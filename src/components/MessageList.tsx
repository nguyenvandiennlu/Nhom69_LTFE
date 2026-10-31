import type { Message } from '../types/message';
import { Fragment, useEffect, useRef } from "react";
import MessageItem from './MessageItem';
import { Hash } from 'lucide-react';

interface Props {
    messages: Message[];
    username: string;
    onDelete?: (id: string) => void;
}

export default function MessageList({ messages, username, onDelete }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView();
    }, [messages]);
    return (
        <div className="message-list flex-grow-1 overflow-auto">
            <div className="message-list__empty px-3">
                <div className="message-list__empty-icon">
                    <Hash size={36} />
                </div>
                <h4 className="fw-bold mt-3 mb-1">Chào mừng đến #chat-chung</h4>
                <p className="text-secondary">Đây là khởi đầu của kênh #chat-chung. Hãy gửi tin nhắn đầu tiên!</p>
            </div>
            {messages.map((m, i) => {
                const day = new Date(m.time).toLocaleDateString("vi-VN", {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
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

                let isGrouped = false;
                if (i > 0 && m.user === messages[i - 1].user && day === prevDay) {
                    isGrouped = true;
                }

                return (
                    <Fragment key={m.id}>
                        {dividerElement}
                        <MessageItem 
                            message={m} 
                            isOwn={m.user === username} 
                            isGrouped={isGrouped} 
                            onDelete={onDelete}
                        />
                    </Fragment>
                );
            })}
            <div ref={bottomRef}></div>
        </div>
    );
}
