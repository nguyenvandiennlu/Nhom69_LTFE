import type { Message } from '../types/message';

export function normalizeMessage(raw: unknown): Message {
    let data: Record<string, unknown> = {};

    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            data = typeof parsed === 'object' && parsed !== null ? parsed : { text: raw };
        } catch {
            data = { text: raw }; 
        }
    }

    return {
        id: String(data.id ?? crypto.randomUUID()),
        user: String(data.user ?? 'Ẩn danh'),
        text: String(data.text ?? ''),
        time: String(data.time ?? new Date().toISOString()),
    };
}