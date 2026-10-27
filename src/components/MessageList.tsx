import type { Message } from '../types/message';
import MessageItem from './MessageItem';

interface Props {
    messages: Message[];
    username: string;
}

export default function MessageList({ messages, username }: Props) {
    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            {messages.map((m) => (
                <MessageItem key={m.id} message={m} isOwn={m.user === username} />
            ))}
        </div>
    );
}