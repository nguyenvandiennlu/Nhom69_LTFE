import { useWS } from '../contexts/WebSocketContext';
import { useEffect, useState } from 'react';
import ServerRail from '../components/ServerRail';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import MemberList from '../components/MemberList';
import { normalizeMessage } from '../services/messageUtils';
import { Hash, User } from 'lucide-react';
import type { Message, CurrentChat } from '../types/message';

const initialChats: CurrentChat[] = [
    { name: 'chat-chung', type: 'room' },
    { name: 'Gaming', type: 'room' },
    { name: 'dead-line', type: 'room' },
    { name: 'Điền', type: 'people' },
    { name: 'Duy', type: 'people' },
    { name: 'Dĩ', type: 'people' },
];

export default function ChatPage() {
    const { status, sendEvent, lastMessage } = useWS();
    // const [messages, setMessages] = useState<Message[]>([]);
    const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});
    const [currentChat, setCurrentChat] = useState<CurrentChat>({ name: 'chat-chung', type: 'room' });
    const [chats] = useState<CurrentChat[]>(initialChats);
    const username = localStorage.getItem('currentUser') || 'PIGGY';
    const currentKey = `${currentChat.type}:${currentChat.name}`;
    const messages = messagesByChat[currentKey] ?? [];

    useEffect(() => {
        if (!lastMessage) return;

        if (lastMessage.event === 'SEND_CHAT' && lastMessage.status === 'success') {
            const newMsg = normalizeMessage(lastMessage.data);
            const key = newMsg.type === 0
                ? `people:${newMsg.user}` : `room:${newMsg.to}`;
            setMessagesByChat((prev) => ({
                ...prev,
                [key]: [...(prev[key] ?? []), newMsg],}));
        }
    }, [lastMessage]);

    const handleSend = (text: string) => {
        sendEvent('SEND_CHAT', {
            type: currentChat.type,
            to: currentChat.name,
            mes: text,
        });
        if (currentChat.type === 'people') {
            const myMsg: Message = {
                id: crypto.randomUUID(),
                user: username,
                text: text,
                time: new Date().toISOString(),
                to: currentChat.name,
                type: 0,
            };
            setMessagesByChat((prev) => ({
                ...prev,
                [currentKey]: [...(prev[currentKey] ?? []), myMsg],
            }));
        }
    };

    const handleDelete = (id: string) => {
        setMessagesByChat((prev) => ({
            ...prev,
            [currentKey]: (prev[currentKey] ?? []).filter((m) => m.id !== id),
        }));
    };

    return (
        <div className="d-flex vh-100 overflow-hidden">
            <ServerRail />
            <Sidebar 
                currentChat={currentChat} 
                chats={chats} 
                onSelectChat={setCurrentChat} 
            />
            <main className="chat-main d-flex flex-column flex-grow-1">
                <header className="chat-main__header d-flex align-items-center gap-2">
                    <span className="chat-main__title d-flex align-items-center gap-1">
                        {currentChat.type === 'room' ? (
                            <Hash size={18} className="text-secondary" />
                        ) : (
                            <User size={18} className="text-secondary" />
                        )}
                        {currentChat.name}
                    </span>
                    <span className={`chat-main__dot chat-main__dot--${status}`}></span>
                    <span className="chat-main__status">{status}</span>
                </header>

                <MessageList 
                    messages={messages} 
                    username={username} 
                    currentChat={currentChat}
                    onDelete={handleDelete} 
                />
                <ChatInput onSend={handleSend} currentChat={currentChat} />
            </main>
            <MemberList />
        </div>
    );
}
