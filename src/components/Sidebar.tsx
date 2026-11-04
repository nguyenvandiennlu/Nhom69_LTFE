import { useState } from "react";
import { Hash } from "lucide-react";
import type { CurrentChat } from '../types/message';
import UserProfileBar from "./UserProfileBar";
import '../styles/sidebar.scss';

// const rooms = ['chat-chung', 'Gaming', 'dead-line'];
// const onlineUsers = ['PIGGY', 'Điền', 'Duy', 'Dĩ', 'test2222']; bỏ cái này đê


interface Props {
    currentChat: CurrentChat;
    chats: CurrentChat[];
    onSelectChat: (chat: CurrentChat) => void;
}

export default function Sidebar({ currentChat, chats, onSelectChat }: Props) {
    //const [currentRoom, setCurrentRoom] = useState(rooms[0]); bỏ cái này đê
    const [isOpen, setIsOpen] = useState(true);
    const rooms = chats.filter((c) => c.type === 'room');
    const people = chats.filter((c) => c.type === 'people');

    return (
        <aside className="sidebar">
            <div className="sidebar__content">
                <div className="titleSidebar" onClick={() => setIsOpen(!isOpen)}>
                    <span>{isOpen ? 'v' : '>'} Kênh trò chuyện</span>
                    <span className="addRoom">+</span>
                </div>
                {isOpen && rooms.map(room => (
                    <div
                        key={room.name}
                        className={currentChat.type === 'room' && currentChat.name === room.name ? 'room roomActive' : 'room'}
                        onClick={() => onSelectChat(room)}
                    >
                        <Hash size={16} />
                        <span>{room.name}</span>
                    </div>
                ))}

                <div className="titleSidebar">Trực tuyến — {people.length}</div>
                {people.map(person => (
                    <div key={person.name}
                         className={currentChat.type === 'people' && currentChat.name === person.name ? 'user userActive' : 'user'}
                         onClick={() => onSelectChat(person)}
                    >
                        <span className="dotSidebar"></span>
                        <span>{person.name}</span>
                    </div>
                ))}
            </div>

            <UserProfileBar />
        </aside>
    );
}
