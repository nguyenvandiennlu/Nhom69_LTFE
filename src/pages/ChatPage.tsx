import { useWS } from '../contexts/WebSocketContext';
import { useEffect, useState, useRef } from 'react';
import ServerRail from '../components/ServerRail';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import MemberList from '../components/MemberList';
import { normalizeMessage } from '../services/messageUtils';
import { Hash, AtSign  } from 'lucide-react';
import type { Message, CurrentChat } from '../types/message';
import FriendsPage from '../components/FriendsPage';

export default function ChatPage() {
    const { status, sendEvent, lastMessage, isAuthenticated } = useWS();
    const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});
    const [currentChat, setCurrentChat] = useState<CurrentChat>({ name: 'chat-chung', type: 'room' });
    const [chats, setChats] = useState<CurrentChat[]>([]);
    const username = localStorage.getItem('currentUser') || 'PIGGY';
    const currentKey = `${currentChat.type}:${currentChat.name}`;
    const messages = messagesByChat[currentKey] ?? [];
    const historyFor = useRef('');
    const [showFriends, setShowFriends] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            sendEvent('GET_USER_LIST');
        }
    }, [isAuthenticated, sendEvent]);

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
        if (lastMessage.event === 'GET_USER_LIST' && lastMessage.status === 'success') {
            const list = lastMessage.data as { name: string; type: number ; actionTime: string}[];
            const sorted = [...list].sort((a, b) => (a.actionTime < b.actionTime ? 1 : -1));
            const newChats: CurrentChat[] = sorted.map((item) => ({
                name: item.name,
                type: item.type === 1 ? 'room' : 'people',
            }));
            setChats(newChats);
        }
        if (lastMessage.event === 'GET_PEOPLE_CHAT_MES' && lastMessage.status === 'success') {
            const list = lastMessage.data as unknown[];
            const history = list.map((item) => normalizeMessage(item));
            history.sort((a, b) => (a.time < b.time ? -1 : 1));

            const key = `people:${historyFor.current}`;
            setMessagesByChat((prev) => ({ ...prev, [key]: history }));
        }
    }, [lastMessage]);

    useEffect(() => {
        if (currentChat.type !== 'people') return;
        historyFor.current = currentChat.name;
        sendEvent('GET_PEOPLE_CHAT_MES', { name: currentChat.name, page: 1 });
    }, [currentChat, sendEvent]);

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
    const handleSelectChat = (chat: CurrentChat) => {
        setCurrentChat(chat);
        setShowFriends(false);
    };
    return (
        <div className="d-flex vh-100 overflow-hidden">
            <ServerRail />
            <Sidebar 
                currentChat={currentChat} 
                chats={chats} 
                onSelectChat={handleSelectChat}
                showFriends={showFriends}
                onShowFriends={() => setShowFriends(true)}
            />
            <main className="chat-main d-flex flex-column flex-grow-1">
                {showFriends ? (
                    <FriendsPage friends={chats.filter((c) => c.type === 'people')} onOpenChat={handleSelectChat}/>
                ) : (
                <>
                    <header className="chat-main__header d-flex align-items-center gap-2">
                    <span className="chat-main__title d-flex align-items-center gap-1">
                        {currentChat.type === 'room' ? (
                            <Hash size={18} className="text-secondary" />
                        ) : (
                            <AtSign size={18} className="text-secondary" />
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
                </>)}

            </main>
            <MemberList />
        </div>
    );
}
