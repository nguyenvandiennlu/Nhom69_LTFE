import { useEffect, useRef } from "react";
import { useWS } from "../contexts/WebSocketContext";
import { useAppSelector } from "../store/hooks";
import { normalizeMessage } from "../services/messageUtils";
import notifySound from "../assets/notify.mp3";

const sound = new Audio(notifySound);

export default function NewMessageNotifier() {
    const { lastMessage } = useWS();
    const username = useAppSelector((state) => state.auth.username);
    const oldTitle = useRef(document.title);
    const unread = useRef(0);

    useEffect(() => {
        if (lastMessage?.event !== 'SEND_CHAT' || lastMessage.status !== 'success') return;
        const newMsg = normalizeMessage(lastMessage.data);
        if (newMsg.user === username || document.hasFocus()) return;
        unread.current += 1;
        document.title = '(' + unread.current + ') Tin nhắn mới';
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }, [lastMessage, username]);

    useEffect(() => {
        const title = oldTitle.current;
        const handleFocus = () => {
            unread.current = 0;
            document.title = title;
        };
        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
            document.title = title;
        };
    }, []);

    return null;
}
