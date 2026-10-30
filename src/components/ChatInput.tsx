import { useState } from 'react';

interface Props {
    onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: Props) {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text);
        setText('');
    };

    return (
        <div className="chat-input px-3 pb-3">
            <div className="chat-input__bar d-flex align-items-center gap-2">
                <button className="chat-input__icon" title="Đính kèm">+</button>
                <input
                    className="chat-input__field flex-grow-1"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Nhắn #chat-chung"
                />
                <button className="chat-input__icon chat-input__icon--gif" title="GIF">GIF</button>
                <button className="chat-input__icon" title="Emoji">😊</button>
                <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={!text.trim()}>Gửi</button>
            </div>
        </div>
    );
}