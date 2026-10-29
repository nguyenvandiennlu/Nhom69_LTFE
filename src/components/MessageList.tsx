import type { Message } from '../types/message';
import {Fragment, useEffect, useRef} from "react";
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
        <div className="message-list flex-grow-1 overflow-auto">
            {messages.map((m, i) => {
                const day = new Date(m.time).toLocaleDateString("vi-VN", {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
                let prevDay = '';
                if (i > 0) {
                    prevDay = new Date(messages[i - 1].time).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                }
                let dividerElement = null;
                if (day !== prevDay) {
                    dividerElement = <div className="message-list__divider">{day}</div>;
                }

                return (
                    <Fragment key={m.id}>
                        {dividerElement}
                        <MessageItem message={m} isOwn={m.user === username} />
                    </Fragment>
                );
            })}
            <div ref={bottomRef}></div>
        </div>
    );
}