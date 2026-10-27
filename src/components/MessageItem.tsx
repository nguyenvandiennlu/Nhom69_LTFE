import type { Message } from '../types/message';

interface Props {
    message: Message;
}

export default function MessageItem({ message }: Props) {
    return (
        <div>
            <b>{message.user}:</b> {message.text}
        </div>
    );
}