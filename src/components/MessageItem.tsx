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
                <div>
                    <div className="message-username" style={{ textAlign: isOwn ? 'right' : 'left' }}>
                        {message.user}
                    </div>
                    <div className="message" style={{background: isOwn ? '#d1e7ff' : '#e4e6eb'}}>
                        {message.text}
                        <div style={{fontSize: 11, opacity: 0.7}}>
                            {new Date(message.time).toLocaleString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}