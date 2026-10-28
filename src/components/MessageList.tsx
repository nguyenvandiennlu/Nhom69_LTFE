import type { Message } from '../types/message';
import {useEffect, useRef} from "react";
import MessageItem from './MessageItem';

interface Props {
    messages: Message[];
    username: string;
}

export default function MessageList({ messages, username }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(bottomRef.current) bottomRef.current.scrollIntoView();
    }, [messages]);
    return (
        <div className="flex-grow-1 overflow-auto">
            {messages.map((m) => (
                <MessageItem key={m.id} message={m} isOwn={m.user === username} />
            ))}
            <div ref={bottomRef}></div>
        </div>
    );
}