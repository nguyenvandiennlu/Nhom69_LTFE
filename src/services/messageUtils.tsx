import type { Message } from '../types/message';

export function normalizeMessage(raw: unknown): Message {
    let data: Record<string, unknown> = {};

    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            data = typeof parsed === 'object' && parsed !== null ? parsed : { mes: raw };
        } catch {
            data = { mes: raw };
        }
    } else if (typeof raw === 'object' && raw !== null) {
        data = raw as Record<string, unknown>;
    }

    return {
        id: String(data.id ?? crypto.randomUUID()),
        user: String(data.name ?? data.user ?? 'Ẩn danh'),
        text: String(data.mes ?? data.text ?? ''),
        time: String(data.createAt ?? data.time ?? new Date().toISOString()),
        to: data.to ? String(data.to) : undefined,
        type: typeof data.type === 'number' ? data.type : (data.type === 'room' ? 1 : 0),
    };
}
