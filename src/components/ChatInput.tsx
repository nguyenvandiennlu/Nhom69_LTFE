import { useState, useRef } from 'react';
import { PlusCircle, Send } from 'lucide-react';
import EmojiPickerButton from './EmojiPickerButton';

interface Props {
    onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: Props) {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text);
        setText('');
    };

    const handleSelectEmoji = (emoji: string) => {
        setText((prev) => prev + emoji);
        textareaRef.current?.focus();
    };

    return (
        <div className="chat-input px-3 pb-3">
            <div className="chat-input__bar d-flex align-items-center gap-2">
                <button type="button" className="chat-input__icon d-flex align-items-center" title="Đính kèm">
                    <PlusCircle size={20} />
                </button>
                <textarea
                    ref={textareaRef}
                    className="chat-input__field flex-grow-1"
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Nhắn #chat-chung"
                />
                <button type="button" className="chat-input__icon chat-input__icon--gif" title="GIF">GIF</button>
                <EmojiPickerButton onSelectEmoji={handleSelectEmoji} />
                <button 
                    type="button"
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1" 
                    onClick={handleSend} 
                    disabled={!text.trim()}
                >
                    <Send size={15} />
                    <span>Gửi</span>
                </button>
            </div>
        </div>
    );
}
