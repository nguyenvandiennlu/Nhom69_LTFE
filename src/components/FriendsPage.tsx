import { Users, MessageCircle } from 'lucide-react';
import type { CurrentChat } from '../types/message';

interface Props {
    friends: CurrentChat[];
    onOpenChat: (chat: CurrentChat) => void;
}
export default function FriendsPage({ friends, onOpenChat }: Props) {
    return (
        <div className="friends d-flex flex-column flex-grow-1">
            <header className="friends__header d-flex align-items-center gap-2">
                <Users size={20} />
                <span className="friends__title">Bạn bè</span>
            </header>
            <div className="friends__body flex-grow-1">{friends.map((f) => {
                const colorIndex = f.name.charCodeAt(0) % 5;
                return (
                    <div
                        key={f.name}
                        className="friends__item d-flex align-items-center gap-3"
                        onClick={() => onOpenChat(f)}
                    >
                        <div className={`friends__avatar friends__avatar--${colorIndex}`}>
                            {f.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="friends__name flex-grow-1">{f.name}</span>
                        <button className="friends__action" title="Nhắn tin">
                            <MessageCircle size={18} />
                        </button>
                    </div>
                );
            })}

                {friends.length === 0 && (
                    <div className="friends__empty">Danh sách bạn bè</div>
                )}
            </div>
        </div>
    );
}