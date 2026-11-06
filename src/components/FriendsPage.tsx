import { Users } from 'lucide-react';

export default function FriendsPage() {
    return (
        <div className="friends d-flex flex-column flex-grow-1">
            <header className="friends__header d-flex align-items-center gap-2">
                <Users size={20} />
                <span className="friends__title">Bạn bè</span>
            </header>
            <div className="friends__body flex-grow-1">
                <div className="friends__empty">Danh sách bạn bè</div>
            </div>
        </div>
    );
}