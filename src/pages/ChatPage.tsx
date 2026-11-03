import { useWS } from '../contexts/WebSocketContext';
import { useEffect, useState } from 'react';
import ServerRail from '../components/ServerRail';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import MemberList from '../components/MemberList';
import { Hash } from 'lucide-react';
import type { Message, CurrentChat } from '../types/message';

export default function ChatPage() {
    const { status, sendEvent, lastMessage } = useWS();
    const [messages, setMessages] = useState<Message[]>([]);
    // Tạmmm
    const username = 'Rời shaco ấy';
    const currentChat: CurrentChat = { name: 'test2222', type: 'people' };
    // Tạmmm

    useEffect(() => {
        console.log('WS nhận:', lastMessage);
        if (!lastMessage) return;

        if (lastMessage.event === 'SEND_CHAT' && lastMessage.status === 'success') {
            const data = lastMessage.data;
            const newMsg: Message = {
                id: String(data.id ?? crypto.randomUUID()),
                user: data.name,
                text: data.mes,
                time: data.createAt ?? new Date().toISOString(),
            };
            setMessages((prev) => [...prev, newMsg]);
        }
    }, [lastMessage]);

    const handleSend = (text: string) => {
        sendEvent('SEND_CHAT', {
            type: currentChat.type,
            to: currentChat.name,
            mes: text,
        });
        setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), user: username, text, time: new Date().toISOString() },
        ]);
    };

    const handleDelete = (id: string) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <div className="d-flex vh-100 overflow-hidden">
            <ServerRail />
            <Sidebar />
            <main className="chat-main d-flex flex-column flex-grow-1">
                <header className="chat-main__header d-flex align-items-center gap-2">
                    <span className="chat-main__title d-flex align-items-center gap-1">
                        <Hash size={18} className="text-secondary" />
                        chat-chung
                    </span>
                    <span className={`chat-main__dot chat-main__dot--${status}`}></span>
                    <span className="chat-main__status">{status}</span>
                </header>

                <MessageList 
                    messages={messages} 
                    username={username} 
                    onDelete={handleDelete} 
                />
                <ChatInput onSend={handleSend} />
            </main>
            <MemberList />
        </div>
    );
}
