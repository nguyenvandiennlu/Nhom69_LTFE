import { mockMembers } from '../types/TempMember';
import MemberItem from './MemberItem';
import { Search } from 'lucide-react';
import {useState} from 'react';

export default function MemberList() {
    const [keyword, setKeyword] = useState('');
    const foundMembers = mockMembers.filter((m) =>
        m.name.toLowerCase().includes(keyword.toLowerCase())
    );
    const onlineMembers = foundMembers.filter((m) => m.status !== 'offline');
    const offlineMembers = foundMembers.filter((m) => m.status === 'offline');

    return (
        <aside className="member-list">
            <div className="member-list__search">
                <div className="member-list__search-box d-flex align-items-center">
                    <input
                        className="member-list__search-input flex-grow-1"
                        placeholder="Tìm kiếm thành viên"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <Search size={16} />
                </div>
            </div>
            {onlineMembers.length > 0 && (
            <div className="member-list__group-title">
                Trực tuyến — {onlineMembers.length}
            </div>
            )}
            {onlineMembers.map((m) => (
                <MemberItem key={m.id} member={m} />
            ))}
            {onlineMembers.length > 0 && (
            <div className="member-list__group-title">
                Ngoại tuyến — {offlineMembers.length}
            </div>
            )}
            {offlineMembers.map((m) => (
                <MemberItem key={m.id} member={m} />
            ))}
            {foundMembers.length === 0 && (
                <div className="member-list__empty">Không tìm thấy thành viên</div>
            )}
        </aside>
    );
}