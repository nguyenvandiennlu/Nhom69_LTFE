import { useState } from 'react';
import type { Message } from '../types/message';

interface Props {
    message: Message;
    isOwn: boolean;
    isGrouped: boolean;
    onDelete?: (id: string) => void;
}

export default function MessageItem({ message, isOwn, isGrouped, onDelete }: Props) {
    const [copied, setCopied] = useState(false);
    const colorIndex = message.user.charCodeAt(0) % 5;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Không thể sao chép tin nhắn:', err);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc muốn xóa tin nhắn này không?')) {
            onDelete?.(message.id);
        }
    };

    return (
        <div className={isGrouped ? "message d-flex gap-3 px-3 py-0" : "message d-flex gap-3 px-3 py-2"}>
            {isGrouped ?
                (<div className="message__spacer"></div>)
                :
                (<div className={`message__avatar message__avatar--${colorIndex}`}>
                    {message.user.charAt(0).toUpperCase()}
                </div>)
            }

            <div className="message__body">
                {!isGrouped && (
                    <div>
                        <span className={isOwn ? 'message__name message__name--own' : 'message__name'}>
                            {message.user}
                        </span>
                        <span className="message__time ms-2">
                            {new Date(message.time).toLocaleString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                        </span>
                    </div>
                    )
                }
                <div className="message__text">{message.text}</div>
            </div>

            <div className="message__toolbar">
                <button className="message__action" title="Trả lời">⤷</button>
                <button 
                    className="message__action" 
                    title={copied ? "Đã sao chép!" : "Sao chép"} 
                    onClick={handleCopy}
                >
                    {copied ? '✓' : '⎘'}
                </button>
                <button 
                    className="message__action message__action--danger" 
                    title="Xóa" 
                    onClick={handleDelete}
                >
                    ✕
                </button>
            </div>

        </div>
    );
}
