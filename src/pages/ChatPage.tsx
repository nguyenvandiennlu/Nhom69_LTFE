import { useWebSocket } from '../hooks/useWebSocket';
import { WS_URL } from '../services/config';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';

export default function ChatPage() {
    const { messages, status, send } = useWebSocket(WS_URL);
    const username = 'PIGGY';

    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <main className="chat-main d-flex flex-column flex-grow-1">
                <header className="chat-main__header">Trạng thái: {status}</header>
                <MessageList messages={messages} username={username}/>
                <ChatInput onSend={(text) => send(username, text)} />
            </main>
        </div>
    );
}