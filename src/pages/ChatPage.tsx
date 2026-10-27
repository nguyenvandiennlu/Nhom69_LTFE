import { useWebSocket } from '../hooks/useWebSocket';
import { WS_URL } from '../services/config';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';

export default function ChatPage() {
    const { messages, status, send } = useWebSocket(WS_URL);
    const username = 'PIGGY';

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header>Trạng thái: {status}</header>
                <MessageList messages={messages} />
                <ChatInput onSend={(text) => send(username, text)} />
            </main>
        </div>
    );
}