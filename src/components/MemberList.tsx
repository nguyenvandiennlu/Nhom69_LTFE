import { mockMembers } from '../types/TempMember';

export default function MemberList() {
    const onlineMembers = mockMembers.filter((m) => m.status !== 'offline');
    const offlineMembers = mockMembers.filter((m) => m.status === 'offline');

    return (
        <aside className="member-list">
            <div className="member-list__group-title">
                Trực tuyến — {onlineMembers.length}
            </div>
            {onlineMembers.map((m) => (
                <div key={m.id}>{m.name}</div>
            ))}

            <div className="member-list__group-title">
                Ngoại tuyến — {offlineMembers.length}
            </div>
            {offlineMembers.map((m) => (
                <div key={m.id}>{m.name}</div>
            ))}
        </aside>
    );
}