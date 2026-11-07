import { Users, MessageCircle, Search, X } from 'lucide-react';
import type { CurrentChat } from '../types/message';
import { useState } from 'react';

interface Props {
    friends: CurrentChat[];
    onOpenChat: (chat: CurrentChat) => void;
    onAddFriend: (name: string) => void;
    addError: string;
}
export default function FriendsPage({ friends, onOpenChat, onAddFriend, addError }: Props) {
    const [tab, setTab] = useState('all');
    const [keyword, setKeyword] = useState('');
    const found = friends.filter((f) =>
        f.name.toLowerCase().includes(keyword.toLowerCase())
    );
    const [newName, setNewName] = useState('');
    const handleAdd = () => {
        const name = newName.trim();
        if (name === '') return;
        onAddFriend(name);
        setNewName('');
    };
    const title = tab === 'online' ? 'Trực tuyến' : 'Tất cả bạn bè';
    return (
        <div className="friends d-flex flex-column flex-grow-1">
            <header className="friends__header d-flex align-items-center gap-3">
                <span className="friends__title d-flex align-items-center gap-2">
                    <Users size={20} />
                    Bạn bè
                </span>
                <button
                    className={tab === 'online' ? 'friends__tab friends__tab--active' : 'friends__tab'}
                    onClick={() => setTab('online')}
                >
                    Trực tuyến
                </button>
                <button
                    className={tab === 'all' ? 'friends__tab friends__tab--active' : 'friends__tab'}
                    onClick={() => setTab('all')}
                >
                    Tất cả
                </button>
                <button
                    className="friends__tab friends__tab--add"
                    onClick={() => setTab('add')}
                >
                    Thêm Bạn
                </button>
            </header>
            <div className="friends__body flex-grow-1">
                {tab === 'add' && (
                    <div>
                        <div className="friends__group-title">Thêm bạn</div>
                        <p className="friends__hint">Nhập tên người dùng để bắt đầu trò chuyện.</p>
                        <div className="friends__add d-flex align-items-center gap-2">
                            <input
                                className="friends__add-input flex-grow-1"
                                placeholder="Nhập tên người dùng"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAdd();
                                }}
                            />
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleAdd}
                                disabled={!newName.trim()}
                            >
                                Gửi
                            </button>
                        </div>
                        {addError && <div className="friends__error">{addError}</div>}
                    </div>
                )}
                {tab !== 'add' && (
                    <>
                        <div className="friends__search d-flex align-items-center">
                            <input
                                className="friends__search-input flex-grow-1"
                                placeholder="Tìm kiếm"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            {keyword ? (
                                <button className="friends__clear" onClick={() => setKeyword('')} title="Xóa">
                                    <X size={16} />
                                </button>
                            ) : (
                                <Search size={16} />
                            )}
                        </div>
                        <div className="friends__group-title">{title} - {found.length}</div>
                        {found.map((f) => {
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
                    </>
                )}
            </div>
        </div>
    );
}