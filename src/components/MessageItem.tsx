import type { Message } from '../types/message';
import './MessageItem.css';

interface Props {
    message: Message;
}

export default function MessageItem({ message }: Props) {
    return (
        <div className="message" style={{background: message.user === 'PIGGY' ? '#d1e7ff' : '#e4e6eb'}}>
            <b>{message.user}:</b> {message.text}
        </div>
    );
}