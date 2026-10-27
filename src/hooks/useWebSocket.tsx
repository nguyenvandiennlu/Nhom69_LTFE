import { useEffect, useRef, useState, useCallback } from 'react';
import { normalizeMessage } from '../services/messageUtils';
import type { Message } from '../types/message';

type Status = 'connecting' | 'open' | 'closed';

export function useWebSocket(url: string) {
    const wsRef = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<Status>('connecting');

    useEffect(() => {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => setStatus('open');
        ws.onclose = () => setStatus('closed');
        ws.onerror = () => setStatus('closed');
        ws.onmessage = (e: MessageEvent) => {
            console.log('3. nhận được:', e.data);
            setMessages((prev) => [...prev, normalizeMessage(e.data)]);
        };

        return () => ws.close();
    }, [url]);

    const send = useCallback((user: string, text: string) => {
        console.log('2. send, readyState =', wsRef.current?.readyState);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({ user, text, time: new Date().toISOString() })
            );
        }
    }, []);

    return { messages, status, send };
}