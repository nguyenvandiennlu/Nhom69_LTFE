import type { Member } from '../types/Member';

interface Props {
    member: Member;
}

export default function MemberItem({ member }: Props) {
    const colorIndex = member.name.charCodeAt(0) % 5;

    return (
        <div className="member d-flex align-items-center gap-2 px-2 py-1">
            <div className={`member__avatar member__avatar--${colorIndex}`}>
                {member.name.charAt(0).toUpperCase()}
                <span className={`member__dot member__dot--${member.status}`}></span>
            </div>
            <div className="member__info">
                <div className="d-flex align-items-center gap-1">
                    <span className="member__name">{member.name}</span>
                    {member.isBot && <span className="member__badge">APP</span>}
                </div>
                {member.customStatus && (
                    <div className="member__status text-truncate">{member.customStatus}</div>
                )}
            </div>
        </div>
    );
}