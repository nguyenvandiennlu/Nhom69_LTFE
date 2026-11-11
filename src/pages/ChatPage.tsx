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
import type { Member } from '../types/Member';

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
    const checkingUser = useRef('');
    const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});
    const [roomInfo, setRoomInfo] = useState<Record<string, { own: string; users: { id: number; name: string }[] }>>({});
    const onlineQueue = useRef<string[]>([]);
    const checkingOnline = useRef('');
    const [addError, setAddError] = useState('');
    console.log('chats:', chats);
    const askNextOnline = () => {
        const name = onlineQueue.current.shift();
        if (name === undefined) {
            checkingOnline.current = '';
            return;
        }
        checkingOnline.current = name;
        sendEvent('CHECK_USER_ONLINE', { user: name });
    };
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
            const isMyRoomMsg = newMsg.type === 1 && newMsg.user === username;
            if (!isMyRoomMsg) {
                setMessagesByChat((prev) => ({
                    ...prev,
                    [key]: [...(prev[key] ?? []), newMsg],}));
            }
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
        if (lastMessage.event === 'GET_ROOM_CHAT_MES' && lastMessage.status === 'success') {
            const room = lastMessage.data as { name: string; own: string; userList: { id: number; name: string }[]; chatData: unknown[] };
            const history = (room.chatData ?? []).map((item) => normalizeMessage(item));
            history.sort((a, b) => (a.time < b.time ? -1 : 1));
            const key = `room:${room.name}`;
            setMessagesByChat((prev) => ({ ...prev, [key]: history }));
            setRoomInfo((prev) => ({ ...prev, [room.name]: { own: room.own, users: room.userList ?? [] } }));
        }
        if (lastMessage.event === 'CHECK_USER_EXIST') {
            if (lastMessage.status === 'success') {
                const result = lastMessage.data as { status: boolean };
                const name = checkingUser.current;

                if (result.status) {
                    const newChat: CurrentChat = { name: name, type: 'people' };
                    setChats((prev) => {
                        const isExist = prev.some((c) => {
                            return c.type === 'people' && c.name === name;
                        });
                        if (isExist) {
                            return prev;
                        }
                        return [...prev, newChat];
                    });
                    setCurrentChat(newChat);
                    setShowFriends(false);
                } else {
                    setAddError('Không tìm thấy người dùng "' + name + '"');
                }
            } else {
                setAddError(lastMessage.mes ?? 'Có lỗi xảy ra');
            }
        }
        if (lastMessage.event === 'CHECK_USER_ONLINE' && checkingOnline.current !== '') {
            if (lastMessage.status === 'success') {
                const result = lastMessage.data as { status: boolean };
                const name = checkingOnline.current;
                setOnlineMap((prev) => ({ ...prev, [name]: result.status }));
            }
            askNextOnline();
        }
    }, [lastMessage]);

    useEffect(() => {
        if (currentChat.type !== 'people') return;
        historyFor.current = currentChat.name;
        sendEvent('GET_PEOPLE_CHAT_MES', { name: currentChat.name, page: 1 });
    }, [currentChat, sendEvent]);
    useEffect(() => {
        if (showFriends) return;
        if (currentChat.type !== 'room') return;
        sendEvent('GET_ROOM_CHAT_MES', { name: currentChat.name, page: 1 });
    }, [currentChat, showFriends, sendEvent]);
    useEffect(() => {
        if (!showFriends) return;
        if (checkingOnline.current !== '') return;
        onlineQueue.current = chats.filter((c) => c.type === 'people').map((c) => c.name);
        askNextOnline();
    }, [showFriends, chats]);

    const handleSend = (text: string) => {
        sendEvent('SEND_CHAT', {
            type: currentChat.type,
            to: currentChat.name,
            mes: text,
        });
        const myMsg: Message = {
            id: crypto.randomUUID(),
            user: username,
            text: text,
            time: new Date().toISOString(),
            to: currentChat.name,
            type: currentChat.type === 'room' ? 1 : 0,
        };
        setMessagesByChat((prev) => ({
            ...prev,
            [currentKey]: [...(prev[currentKey] ?? []), myMsg],
        }));
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
    const handleAddFriend = (name: string) => {
        setAddError('');
        if (name === username) {
            setAddError('Không thể nhắn tin cho chính bạn');
            return;
        }
        checkingUser.current = name;
        sendEvent('CHECK_USER_EXIST', { user: name });
    };
    const info = roomInfo[currentChat.name];
    const members: Member[] = [];
    if (currentChat.type === 'room' && info) {
        members.push({
            id: 'own',
            name: info.own,
            // status: 'online',
            status: (info.own === username || onlineMap[info.own]) ? 'online' : 'offline',
            customStatus: 'Chủ phòng',
        });
        info.users.forEach((u) => {
            if (u.name !== info.own) {
                members.push({
                    id: String(u.id),
                    name: u.name,
                    status: (u.name === username || onlineMap[u.name]) ? 'online' : 'offline',
                });
            }
        });
    }
    return (
        <div className="d-flex vh-100 overflow-hidden">
            <ServerRail />
            <Sidebar 
                currentChat={currentChat} 
                chats={chats} 
                onSelectChat={handleSelectChat}
                showFriends={showFriends}
                onShowFriends={() => setShowFriends(true)}
                onlineMap={onlineMap}
            />
            <main className="chat-main d-flex flex-column flex-grow-1">
                {showFriends ? (
                    <FriendsPage
                        friends={chats.filter((c) => c.type === 'people')}
                        onOpenChat={handleSelectChat}
                        onAddFriend={handleAddFriend}
                        addError={addError}
                        onlineMap={onlineMap}
                    />
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
            {!showFriends && currentChat.type === 'room' && <MemberList members={members}/>}
        </div>
    );
}
