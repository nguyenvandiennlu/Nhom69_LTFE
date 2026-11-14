import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WS_URL } from '../services/config';
import { store } from '../store';
import { updateCode, setAuthenticated, logout } from '../store/authSlice';
import {
    addMessage,
    setHistory,
    setChats,
    setRoomInfo,
    shiftHistoryQueue,
} from '../store/chatSlice';
import { normalizeMessage } from '../services/messageUtils';
import type { CurrentChat } from '../types/message';

export interface ServerMessage {
    status?: 'success' | 'error' | string;
    event?: string;
    data?: unknown;
    mes?: string;
    [key: string]: unknown;
}

interface WSContextType {
    status: 'connecting' | 'open' | 'closed';
    sendEvent: (event: string, data?: object) => void;
    lastMessage: ServerMessage | null;
}

const WSContext = createContext<WSContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const pathRef = useRef(location.pathname);
    pathRef.current = location.pathname;

    const wsRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
    const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const isUnmountedRef = useRef(false);
    const isReLoggingIn = useRef(false);

    useEffect(() => {
        isUnmountedRef.current = false;

        function connect() {
            if (isUnmountedRef.current) return;

            setStatus('connecting');
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                setStatus('open');
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }

                const { username: user, reLoginCode: code } = store.getState().auth;
                if (user && code && !isReLoggingIn.current) {
                    isReLoggingIn.current = true;
                    ws.send(JSON.stringify({
                        action: 'onchat',
                        data: {
                            event: 'RE_LOGIN',
                            data: { user, code }
                        }
                    }));
                }
            };

            ws.onmessage = (e: MessageEvent) => {
                console.log('WS nhận:', e.data);
                try {
                    const parsed = JSON.parse(e.data) as ServerMessage;

                    if (parsed.event === 'RE_LOGIN') {
                        isReLoggingIn.current = false;
                        const data = parsed.data as { RE_LOGIN_CODE?: string } | undefined;
                        if (parsed.status === 'success' && data?.RE_LOGIN_CODE) {
                            store.dispatch(updateCode(data.RE_LOGIN_CODE));
                            store.dispatch(setAuthenticated(true));
                        } else if (parsed.status === 'error') {
                            store.dispatch(logout());
                            if (pathRef.current !== '/login') {
                                navigate('/login', { replace: true });
                            }
                        }
                    }

                    if (parsed.event === 'LOGIN' && parsed.status === 'success') {
                        store.dispatch(setAuthenticated(true));
                    }

                    if (parsed.event === 'LOGOUT' && parsed.status === 'success') {
                        store.dispatch(logout());
                    }

                    if (parsed.event === 'SEND_CHAT' && parsed.status === 'success') {
                        const newMsg = normalizeMessage(parsed.data);
                        const currentUsername = store.getState().auth.username;
                        const isMyRoomMsg = newMsg.type === 1 && newMsg.user === currentUsername;
                        if (!isMyRoomMsg) {
                            store.dispatch(addMessage({ message: newMsg, currentUsername }));
                        }
                    }

                    if (parsed.event === 'GET_USER_LIST' && parsed.status === 'success') {
                        const list = parsed.data as { name: string; type: number; actionTime: string }[];
                        const sorted = [...list].sort((a, b) => (a.actionTime < b.actionTime ? 1 : -1));
                        const newChats: CurrentChat[] = sorted.map((item) => ({
                            name: item.name,
                            type: item.type === 1 ? 'room' : 'people',
                        }));
                        store.dispatch(setChats(newChats));
                    }

                    if (parsed.event === 'GET_PEOPLE_CHAT_MES' && parsed.status === 'success') {
                        const list = parsed.data as unknown[];
                        const history = list.map((item) => normalizeMessage(item));
                        const queue = store.getState().chat.pendingHistoryQueue;
                        const key = queue[0] ?? '';
                        store.dispatch(shiftHistoryQueue());
                        if (key) {
                            store.dispatch(setHistory({ key, history, page: 1 }));
                        }
                    }

                    if (parsed.event === 'GET_ROOM_CHAT_MES' && parsed.status === 'success') {
                        const room = parsed.data as {
                            name: string;
                            own: string;
                            userList: { id: number; name: string }[];
                            chatData: unknown[];
                        };
                        const history = (room.chatData ?? []).map((item) => normalizeMessage(item));
                        const key = `room:${room.name}`;
                        store.dispatch(setHistory({ key, history, page: 1 }));
                        store.dispatch(
                            setRoomInfo({
                                roomName: room.name,
                                own: room.own,
                                users: room.userList ?? [],
                            })
                        );
                    }

                    setLastMessage(parsed);
                } catch {
                    console.error('Không parse được:', e.data);
                }
            };

            ws.onerror = () => {
                ws.close();
            };

            ws.onclose = () => {
                if (isUnmountedRef.current) return;
                setStatus('closed');
                store.dispatch(setAuthenticated(false));
                isReLoggingIn.current = false;
                reconnectTimeoutRef.current = window.setTimeout(() => {
                    connect();
                }, 3000);
            };
        }

        connect();

        return () => {
            isUnmountedRef.current = true;
            isReLoggingIn.current = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [navigate]);

    const sendEvent = useCallback((event: string, data?: object) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const payload = {
                action: 'onchat',
                data: { event, data }
            };
            wsRef.current.send(JSON.stringify(payload));
        }
    }, []);

    return (
        <WSContext.Provider value={{ status, sendEvent, lastMessage }}>
            {children}
        </WSContext.Provider>
    );
}

export function useWS() {
    const ctx = useContext(WSContext);
    if (!ctx) throw new Error('useWS phải dùng bên trong WebSocketProvider');
    return ctx;
}
