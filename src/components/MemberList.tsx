import { mockMembers } from '../types/TempMember';
import MemberItem from './MemberItem';
import { Search } from 'lucide-react';

export default function MemberList() {
    const onlineMembers = mockMembers.filter((m) => m.status !== 'offline');
    const offlineMembers = mockMembers.filter((m) => m.status === 'offline');

    return (
        <aside className="member-list">
            <div className="member-list__search">
                <div className="member-list__search-box d-flex align-items-center">
                    <input
                        className="member-list__search-input flex-grow-1"
                        placeholder="Tìm kiếm thành viên"
                    />
                    <Search size={16} />
                </div>
            </div>
            <div className="member-list__group-title">
                Trực tuyến — {onlineMembers.length}
            </div>
            {onlineMembers.map((m) => (
                <MemberItem key={m.id} member={m} />
            ))}

            <div className="member-list__group-title">
                Ngoại tuyến — {offlineMembers.length}
            </div>
            {offlineMembers.map((m) => (
                <MemberItem key={m.id} member={m} />
            ))}
        </aside>
    );
}