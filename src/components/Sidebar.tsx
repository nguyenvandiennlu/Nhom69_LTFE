import { useState } from "react";
import { Hash } from "lucide-react";
import type { CurrentChat } from '../types/message';
import UserProfileBar from "./UserProfileBar";
import '../styles/sidebar.scss';

const rooms = ['chat-chung', 'Gaming', 'dead-line'];
const onlineUsers = ['PIGGY', 'Điền', 'Duy', 'Dĩ', 'test2222'];

interface Props {
    currentChat: CurrentChat;
    onSelectChat: (chat: CurrentChat) => void;
}

export default function Sidebar({ currentChat, onSelectChat }: Props) {
    //const [currentRoom, setCurrentRoom] = useState(rooms[0]); bỏ cái này đê
    const [isOpen, setIsOpen] = useState(true);

    return (
        <aside className="sidebar">
            <div className="sidebar__content">
                <div className="titleSidebar" onClick={() => setIsOpen(!isOpen)}>
                    <span>{isOpen ? 'v' : '>'} Kênh trò chuyện</span>
                    <span className="addRoom">+</span>
                </div>
                {isOpen && rooms.map(room => (
                    <div
                        key={room}
                        className={currentChat.type === 'room' && currentChat.name === room ? 'room roomActive' : 'room'}
                        onClick={() => onSelectChat({ name: room, type: 'room' })}
                    >
                        <Hash size={16} />
                        <span>{room}</span>
                    </div>
                ))}

                <div className="titleSidebar">Trực tuyến — {onlineUsers.length}</div>
                {onlineUsers.map(user => (
                    <div key={user}
                         className={currentChat.type === 'people' && currentChat.name === user ? 'user userActive' : 'user'}
                         onClick={() => onSelectChat({ name: user, type: 'people' })}
                    >
                        <span className="dotSidebar"></span>
                        <span>{user}</span>
                    </div>
                ))}
            </div>

            <UserProfileBar />
        </aside>
    );
}
