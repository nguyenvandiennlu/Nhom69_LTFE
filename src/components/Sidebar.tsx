import { useState } from "react";
import { Hash } from "lucide-react";
import type { CurrentChat } from '../types/message';
import UserProfileBar from "./UserProfileBar";
import CreateRoomModal from "./CreateRoomModal";
import { useWS } from "../contexts/WebSocketContext";
import '../styles/sidebar.scss';

interface Props {
    currentChat: CurrentChat;
    chats: CurrentChat[];
    onSelectChat: (chat: CurrentChat) => void;
}

export default function Sidebar({ currentChat, chats, onSelectChat }: Props) {
    const { sendEvent } = useWS();
    const [isOpen, setIsOpen] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const rooms = chats.filter((c) => c.type === 'room');
    const people = chats.filter((c) => c.type === 'people');

    const handleCreateRoom = (roomName: string) => {
        sendEvent('CREATE_ROOM', { name: roomName });
        onSelectChat({ name: roomName, type: 'room' });
    };

    return (
        <aside className="sidebar">
            <div className="sidebar__content">
                <div className="titleSidebar" onClick={() => setIsOpen(!isOpen)}>
                    <span>{isOpen ? 'v' : '>'} Kênh trò chuyện</span>
                    <span 
                        className="addRoom" 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCreateModalOpen(true);
                        }}
                        title="Tạo kênh mới"
                    >
                        +
                    </span>
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

                <div className="titleSidebar">Tin nhắn riêng — {people.length}</div>
                {people.map(person => (
                    <div 
                        key={person.name}
                        className={currentChat.type === 'people' && currentChat.name === person.name ? 'user userActive' : 'user'}
                        onClick={() => onSelectChat(person)}
                    >
                        <span className="dotSidebar"></span>
                        <span>{person.name}</span>
                    </div>
                ))}
            </div>

            <UserProfileBar />

            <CreateRoomModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateRoom={handleCreateRoom}
            />
        </aside>
    );
}
