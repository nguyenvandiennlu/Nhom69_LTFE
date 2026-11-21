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
        text: decodeEmoji(String(data.mes ?? data.text ?? '')),
        time: String(data.createAt ?? data.time ?? new Date().toISOString()),
        to: data.to ? String(data.to) : undefined,
        type: typeof data.type === 'number' ? data.type : (data.type === 'room' ? 1 : 0),
    };
}

export function encodeEmoji(text: string): string {
    if (!text) return '';
    return text.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (emoji) {
        const codePoint = emoji.codePointAt(0);
        if (codePoint !== undefined) {
            return `[e:${codePoint.toString(16)}]`;
        }
        return emoji;
    });
}

export function decodeEmoji(text: string): string {
    if (!text) return '';
    return text.replace(/(?:\[e:([0-9a-fA-F]+)\]|\[\[u:([0-9a-fA-F]+)\]\])/g, function (match, hex1, hex2) {
        const hex = hex1 ?? hex2;
        const code = parseInt(hex, 16);
        if (isNaN(code) || code < 0 || code > 0x10FFFF) {
            return match;
        }
        try {
            return String.fromCodePoint(code);
        } catch {
            return match;
        }
    });
}
