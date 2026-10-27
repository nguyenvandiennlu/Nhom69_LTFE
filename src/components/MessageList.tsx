import type { Message } from '../types/message';
import MessageItem from './MessageItem';

interface Props {
    messages: Message[];
}

export default function MessageList({ messages }: Props) {
    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            {messages.map((m) => (
                <MessageItem key={m.id} message={m} />
            ))}
        </div>
    );
}