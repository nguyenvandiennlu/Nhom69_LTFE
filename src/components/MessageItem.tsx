import { useState } from 'react';
import type { Message } from '../types/message';
import { Copy, Check } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { showToast } from '../store/uiSlice';

interface Props {
    message: Message;
    isOwn: boolean;
    isGrouped: boolean;
}

export default function MessageItem({ message, isOwn, isGrouped}: Props) {
    const [copied, setCopied] = useState(false);
    const dispatch = useAppDispatch();
    const colorIndex = message.user.charCodeAt(0) % 5;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
            dispatch(showToast('Đã sao chép tin nhắn'));
        } catch (err) {
            console.error('Không thể sao chép tin nhắn:', err);
            dispatch(showToast('Không thể sao chép tin nhắn'));
        }
    };

    return (
        <>
            <div className={isGrouped ? "message d-flex gap-3 px-3 py-0" : "message d-flex gap-3 px-3 py-2"}>
                {isGrouped ?
                    (<div className="message__spacer">
                            <span className="message__spacer-time">
                                {new Date(message.time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                    </div>)
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
                                {new Date(message.time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    )}
                    <div className="message__text">{message.text}</div>
                </div>

                <div className="message__toolbar">
                    <button
                        className="message__action"
                        title={copied ? "Đã sao chép!" : "Sao chép"}
                        onClick={handleCopy}
                    >
                        {copied ? <Check size={16} color="#23a55a" /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        </>
    );
}
