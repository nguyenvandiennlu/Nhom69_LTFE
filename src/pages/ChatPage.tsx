import { useWS } from '../contexts/WebSocketContext';
import { useEffect, useState } from 'react';
import ServerRail from '../components/ServerRail';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import MemberList from '../components/MemberList';
import { Hash, AtSign } from 'lucide-react';
import type { Message, CurrentChat } from '../types/message';

export default function ChatPage() {
    const { status, sendEvent, lastMessage } = useWS();
    // Tạmmm
    const username = 'test1111';
    const [currentChat, setCurrentChat] = useState<CurrentChat>({ name: 'test2222', type: 'people' });
    // Tạmmm
    const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});
    const [chatList, setChatList] = useState<CurrentChat[]>([]);
    const currentKey = `${currentChat.type}:${currentChat.name}`;
    const messages = messagesByChat[currentKey] ?? [];

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
            const key =  data.type === 0 ? `people:${data.name}` : `room:${data.to}`;
            setMessagesByChat((prev) => {
                let currentList = prev[key];
                if (!currentList) {
                    currentList = [];
                }
                const updatedList = [...currentList, newMsg];
                return {
                    ...prev,
                    [key]: updatedList,
                };
            });
        }
        if ((lastMessage.event === 'LOGIN' || lastMessage.event === 'RE_LOGIN') && lastMessage.status === 'success') {
            sendEvent('GET_USER_LIST');
        }
        if (lastMessage.event === 'GET_USER_LIST' && lastMessage.status === 'success') {
            const list: CurrentChat[] = lastMessage.data.map((item: { name: string; type: number }) => ({
                name: item.name,
                type: item.type === 1 ? 'room' : 'people',
            }));
            setChatList(list);
        }
    }, [lastMessage, sendEvent]);

    const handleSend = (text: string) => {
        sendEvent('SEND_CHAT', {
            type: currentChat.type,
            to: currentChat.name,
            mes: text,
        });
        const newMsg: Message = { id: crypto.randomUUID(), user: username, text, time: new Date().toISOString() };
        setMessagesByChat((prev) => {
            const oldMessages = prev[currentKey] ? prev[currentKey] : [];
            const newMessages = [...oldMessages, newMsg];
            return {
                ...prev,
                [currentKey]: newMessages,
            };
        });
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
            <Sidebar currentChat={currentChat} chats={chatList} onSelectChat={setCurrentChat}/>
            <main className="chat-main d-flex flex-column flex-grow-1">
                <header className="chat-main__header d-flex align-items-center gap-2">
                    <span className="chat-main__title d-flex align-items-center gap-1">
                        {currentChat.type === 'room' ?
                            <Hash size={18} className="text-secondary" />
                            : <AtSign size={18} className="text-secondary" />
                        }
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
