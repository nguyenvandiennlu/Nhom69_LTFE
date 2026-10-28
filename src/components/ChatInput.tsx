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
                <input
                    className="chat-input__field flex-grow-1"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Nhập tin nhắn..."
                />
                <button className="btn btn-primary btn-sm" onClick={handleSend}>Gửi</button>
            </div>
        </div>
    );
}