import { useWS } from '../contexts/WebSocketContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    EMPTY_MESSAGES,
    addChat,
    addMessage,
    deleteMessage,
    pushHistoryQueue,
    setAddError,
    setCurrentChat,
    setOnlineStatus,
    setShowFriends,
} from '../store/chatSlice';
import { useEffect, useRef } from 'react';
import ServerRail from '../components/ServerRail';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import MemberList from '../components/MemberList';
import { encodeEmoji } from '../services/messageUtils';
import { Hash, AtSign } from 'lucide-react';
import type { Message, CurrentChat } from '../types/message';
import FriendsPage from '../components/FriendsPage';
import type { Member } from '../types/Member';
import NewMessageNotifier from '../components/NewMessageNotifier';

export default function ChatPage() {
    const dispatch = useAppDispatch();
    const { status, sendEvent, lastMessage } = useWS();
    const { isAuthenticated, username: authUsername } = useAppSelector((state) => state.auth);

    const currentChat = useAppSelector((s) => s.chat.currentChat);
    const chats = useAppSelector((s) => s.chat.chats);
    const showFriends = useAppSelector((s) => s.chat.showFriends);
    const onlineMap = useAppSelector((s) => s.chat.onlineMap);
    const roomInfo = useAppSelector((s) => s.chat.roomInfo);
    const addError = useAppSelector((s) => s.chat.addError);

    const username = authUsername || 'PIGGY';
    const currentKey = `${currentChat.type}:${currentChat.name}`;
    const messages = useAppSelector((s) => s.chat.messagesByChat[currentKey] ?? EMPTY_MESSAGES);

    const checkingUser = useRef('');
    const onlineQueue = useRef<string[]>([]);
    const checkingOnline = useRef('');

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

        if (lastMessage.event === 'CHECK_USER_EXIST') {
            if (lastMessage.status === 'success') {
                const result = lastMessage.data as { status: boolean };
                const name = checkingUser.current;

                if (result.status) {
                    const newChat: CurrentChat = { name: name, type: 'people' };
                    dispatch(addChat(newChat));
                    dispatch(setCurrentChat(newChat));
                } else {
                    dispatch(setAddError('Không tìm thấy người dùng "' + name + '"'));
                }
            } else {
                dispatch(setAddError(lastMessage.mes ?? 'Có lỗi xảy ra'));
            }
        }

        if (lastMessage.event === 'CHECK_USER_ONLINE' && checkingOnline.current !== '') {
            if (lastMessage.status === 'success') {
                const result = lastMessage.data as { status: boolean };
                const name = checkingOnline.current;
                dispatch(setOnlineStatus({ user: name, status: result.status }));
            }
            askNextOnline();
        }
    }, [lastMessage, dispatch]);

    useEffect(() => {
        if (currentChat.type !== 'people') return;
        dispatch(pushHistoryQueue(`people:${currentChat.name}`));
        sendEvent('GET_PEOPLE_CHAT_MES', { name: currentChat.name, page: 1 });
    }, [currentChat, sendEvent, dispatch]);

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
            mes: encodeEmoji(text),
        });
        const myMsg: Message = {
            id: crypto.randomUUID(),
            user: username,
            text: text,
            time: new Date().toISOString(),
            to: currentChat.name,
            type: currentChat.type === 'room' ? 1 : 0,
        };
        dispatch(addMessage({ message: myMsg, currentUsername: username }));
    };

    const handleDelete = (id: string) => {
        dispatch(deleteMessage({ key: currentKey, id }));
    };

    const handleSelectChat = (chat: CurrentChat) => {
        dispatch(setCurrentChat(chat));
    };

    const handleAddFriend = (name: string) => {
        dispatch(setAddError(''));
        if (name === username) {
            dispatch(setAddError('Không thể nhắn tin cho chính bạn'));
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
            status: info.own === username || onlineMap[info.own] ? 'online' : 'offline',
            customStatus: 'Chủ phòng',
        });
        info.users.forEach((u) => {
            if (u.name !== info.own) {
                members.push({
                    id: String(u.id),
                    name: u.name,
                    status: u.name === username || onlineMap[u.name] ? 'online' : 'offline',
                });
            }
        });
    }

    return (
        <div className="d-flex vh-100 overflow-hidden">
            <NewMessageNotifier />
            <ServerRail />
            <Sidebar
                currentChat={currentChat}
                chats={chats}
                onSelectChat={handleSelectChat}
                showFriends={showFriends}
                onShowFriends={() => dispatch(setShowFriends(true))}
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
                    </>
                )}
            </main>
            {!showFriends && currentChat.type === 'room' && <MemberList members={members} />}
        </div>
    );
}
