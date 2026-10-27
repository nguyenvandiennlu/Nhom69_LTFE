import type { Message } from '../types/message';
import './MessageItem.css';

interface Props {
    message: Message;
    isOwn: boolean;
}

export default function MessageItem({ message, isOwn }: Props) {
    return (
        <div style={{ display: 'flex', justifyContent:'center', width: '100%', marginBottom: '10px' }}>
            <div className="message-container" style={{ justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                <div className="message" style={{background: isOwn ? '#d1e7ff' : '#e4e6eb'}}>
                    <b>{message.user}:</b> {message.text}
                </div>
            </div>
        </div>
    );
}