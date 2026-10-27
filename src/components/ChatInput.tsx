import { useState } from 'react';

interface Props {
    onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: Props) {
    const [text, setText] = useState('');

    const handleSend = () => {
        console.log('1. bấm gửi, text =', text);
        if (!text.trim()) return;
        onSend(text);
        setText('');
    };

    return (
        <div>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSend}>Gửi</button>
        </div>
    );
}