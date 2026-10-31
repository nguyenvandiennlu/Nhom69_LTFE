import { useWebSocket } from '../hooks/useWebSocket';
import { WS_URL } from '../services/config';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { Hash } from 'lucide-react';

export default function ChatPage() {
    const { messages, status, send, deleteMessage } = useWebSocket(WS_URL);
    const username = 'PIGGY';

    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <main className="chat-main d-flex flex-column flex-grow-1">
                <header className="chat-main__header d-flex align-items-center gap-2">
                    <span className="chat-main__title d-flex align-items-center gap-1">
                        <Hash size={18} className="text-secondary" />
                        chat-chung
                    </span>
                    <span className={`chat-main__dot chat-main__dot--${status}`}></span>
                    <span className="chat-main__status">{status}</span>
                </header>

                <MessageList 
                    messages={messages} 
                    username={username} 
                    onDelete={deleteMessage} 
                />
                {/*<ChatInput onSend={(text) => send(username, text)} />*/}
                <ChatInput onSend={(text) => send(['An', 'Bình', 'Chi', 'An'][Math.floor(Math.random() * 4)], text)} />
            </main>
        </div>
    );
}
