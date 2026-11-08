import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WS_URL } from '../services/config';
import { useAuth } from './AuthContext';

export interface ServerMessage {
    status?: 'success' | 'error' | string;
    event?: string;
    data?: unknown;
    mes?: string;
    [key: string]: unknown;
}

interface WSContextType {
    status: 'connecting' | 'open' | 'closed';
    isAuthenticated: boolean;
    sendEvent: (event: string, data?: object) => void;
    lastMessage: ServerMessage | null;
}

const WSContext = createContext<WSContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const pathRef = useRef(location.pathname);
    pathRef.current = location.pathname;

    const { logout, updateCode } = useAuth();
    const wsRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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

                const user = localStorage.getItem('currentUser');
                const code = localStorage.getItem('RE_LOGIN_CODE');
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
                            updateCode(data.RE_LOGIN_CODE);
                            setIsAuthenticated(true);
                        } else if (parsed.status === 'error') {
                            logout();
                            setIsAuthenticated(false);
                            if (pathRef.current !== '/login') {
                                navigate('/login', { replace: true });
                            }
                        }
                    }

                    if (parsed.event === 'LOGIN' && parsed.status === 'success') {
                        setIsAuthenticated(true);
                    }

                    if (parsed.event === 'LOGOUT' && parsed.status === 'success') {
                        setIsAuthenticated(false);
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
                setIsAuthenticated(false);
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
    }, [navigate, logout, updateCode]);

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
        <WSContext.Provider value={{ status, isAuthenticated, sendEvent, lastMessage }}>
            {children}
        </WSContext.Provider>
    );
}

export function useWS() {
    const ctx = useContext(WSContext);
    if (!ctx) throw new Error('useWS phải dùng bên trong WebSocketProvider');
    return ctx;
}
