import { useState } from "react";
import { Hash, Users } from 'lucide-react';

//data tạm thời nha
const rooms = ['Chung', 'Gaming'];
const onlineUsers = ['PIGGY', 'Điền', 'Duy', 'Dĩ'];

export default function Sidebar() {
    const [currentRoom, setCurrentRoom] = useState(rooms[0]);

    return (
        <aside style={{ width: 220 }}>
            <h3>Phòng</h3>
            <ul>
                {rooms.map(room => (
                    <li 
                        key={room} 
                        onClick={() => setCurrentRoom(room)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            fontWeight: room === currentRoom ? 'bold' : 'normal'
                        }}
                    >
                        <Hash size={16} />
                        {room}
                    </li>
                ))}
            </ul>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={18} />
                Online ({onlineUsers.length})
            </h3>
            <ul>
                {onlineUsers.map((user) => (
                    <li key={user}>{user}</li>
                ))}
            </ul>
        </aside>
    );
}
