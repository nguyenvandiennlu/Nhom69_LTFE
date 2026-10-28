import {useState} from "react";
//data tạm thời nha
const rooms = ['Chung', 'Gaming'];
const onlineUsers = ['PIGGY', 'Điền', 'Duy', 'Dĩ'];

export default  function Sidebar(){
    const [currentRoom, setCurrentRoom] = useState(rooms[0]);

    return <>
    <aside style={{ width: 200 }}>
        <h3>Room</h3>
        <ul>
            {rooms.map(room => (
                <li key={room} onClick={() => setCurrentRoom(room)}
                style={{fontWeight: room === currentRoom ? 'bold' : 'normal'}}>
                # {room}
                </li>
            ))}
        </ul>
        <h3>Online ({onlineUsers.length})</h3>
        <ul>
            {onlineUsers.map((user) => (
                <li key={user}>{user}</li>
            ))}
        </ul>
    </aside>
    </>
}