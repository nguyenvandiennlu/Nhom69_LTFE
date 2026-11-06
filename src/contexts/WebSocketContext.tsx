import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { WS_URL } from '../services/config';

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
    const wsRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
    const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const isUnmountedRef = useRef(false);

    useEffect(() => {
        isUnmountedRef.current = false;

        function connect() {
            if (isUnmountedRef.current) return;

            setStatus('connecting');
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                setStatus('open');
                //ws.send(JSON.stringify({ action: 'onchat', data: { event: 'LOGIN', data: { user: 'test1111', pass: 'testtest' } } }));
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            ws.onmessage = (e: MessageEvent) => {
                try {
                    const parsed = JSON.parse(e.data);
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
                reconnectTimeoutRef.current = window.setTimeout(() => {
                    connect();
                }, 3000);
            };
        }

        connect();

        return () => {
            isUnmountedRef.current = true;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

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
