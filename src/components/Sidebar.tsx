import { useState } from "react";
import '../styles/sidebar.scss';

//data tạm thời nha
const rooms = ['chat-chung', 'Gaming', 'dead-line'];
const onlineUsers = ['PIGGY', 'Điền', 'Duy', 'Dĩ'];

export default function Sidebar() {
    const [currentRoom, setCurrentRoom] = useState(rooms[0]);
    const [isOpen, setIsOpen] = useState(true);
    return (
        <aside className="sidebar">
            <div className="titleSidebar" onClick={() => setIsOpen(!isOpen)}>
                <span>{isOpen ? 'v' : '>'} Phòng</span>
                <span className="addRoom">+</span>
            </div>
            {isOpen && rooms.map(room => (
                <div
                    key={room}
                    className={room === currentRoom ? 'room roomActive' : 'room'}
                    onClick={() => setCurrentRoom(room)}
                >
                    # {room}
                </div>
            ))}
            <div className="titleSidebar">Online - {onlineUsers.length}</div>
            {onlineUsers.map(user => (
                <div key={user} className="user">
                    <span className="dotSidebar"></span>
                    {user}
                </div>
            ))}
        </aside>
    );
}
