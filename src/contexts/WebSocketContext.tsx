import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { WS_URL } from '../services/config';

interface WSContextType {
    status: 'connecting' | 'open' | 'closed';
    sendEvent: (event: string, data?: object) => void;
    lastMessage: any;
}

const WSContext = createContext<WSContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const wsRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
    const [lastMessage, setLastMessage] = useState<any>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;
        ws.onopen = () => setStatus('open');
        ws.onclose = () => setStatus('closed');
        ws.onerror = () => setStatus('closed');
        ws.onmessage = (e: MessageEvent) => {
            try {
                const parsed = JSON.parse(e.data);
                setLastMessage(parsed);
            } catch {
                console.error('Không parse được:', e.data);
            }
        };

        return () => ws.close();
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
