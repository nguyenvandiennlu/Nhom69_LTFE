import { useState } from "react";
import { Hash } from "lucide-react";
import UserProfileBar from "./UserProfileBar";
import '../styles/sidebar.scss';

const rooms = ['chat-chung', 'Gaming', 'dead-line'];
const onlineUsers = ['PIGGY', 'Điền', 'Duy', 'Dĩ'];

export default function Sidebar() {
    const [currentRoom, setCurrentRoom] = useState(rooms[0]);
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
                        className={room === currentRoom ? 'room roomActive' : 'room'}
                        onClick={() => setCurrentRoom(room)}
                    >
                        <Hash size={16} />
                        <span>{room}</span>
                    </div>
                ))}

                <div className="titleSidebar">Trực tuyến — {onlineUsers.length}</div>
                {onlineUsers.map(user => (
                    <div key={user} className="user">
                        <span className="dotSidebar"></span>
                        <span>{user}</span>
                    </div>
                ))}
            </div>

            <UserProfileBar />
        </aside>
    );
}
