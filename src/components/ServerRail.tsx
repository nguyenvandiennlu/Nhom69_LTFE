import { useState } from 'react';
import { MessageSquare, Plus, Compass } from 'lucide-react';
import '../styles/serverRail.scss';

interface Server {
    id: string;
    name: string;
    shortName: string;
}

const mockServers: Server[] = [
    { id: 'home', name: 'Tin nhắn trực tiếp', shortName: 'DM' },
    { id: 's1', name: 'Nhóm 69 - LTFE', shortName: 'N69' },
    { id: 's2', name: 'Lập trình Web', shortName: 'WEB' },
    { id: 's3', name: 'Gaming Zone', shortName: 'GAME' },
];

export default function ServerRail() {
    const [activeId, setActiveId] = useState<string>('s1');

    return (
        <aside className="server-rail">
            <div className={`server-rail__item ${activeId === 'home' ? 'server-rail__item--active' : ''}`}>
                <span className="server-rail__pill"></span>
                <button
                    type="button"
                    className={`server-rail__btn ${activeId === 'home' ? 'server-rail__btn--active' : ''}`}
                    title="Tin nhắn trực tiếp"
                    onClick={() => setActiveId('home')}
                >
                    <MessageSquare size={22} />
                </button>
            </div>
            <div className="server-rail__divider"></div>
            {mockServers.filter(s => s.id !== 'home').map((server) => {
                const isActive = activeId === server.id;
                return (
                    <div
                        key={server.id}
                        className={`server-rail__item ${isActive ? 'server-rail__item--active' : ''}`}
                    >
                        <span className="server-rail__pill"></span>
                        <button
                            type="button"
                            className={`server-rail__btn ${isActive ? 'server-rail__btn--active' : ''}`}
                            title={server.name}
                            onClick={() => setActiveId(server.id)}
                        >
                            {server.shortName}
                        </button>
                    </div>
                );
            })}

            <div className="server-rail__item">
                <span className="server-rail__pill"></span>
                <button
                    type="button"
                    className="server-rail__btn server-rail__btn--action"
                    title="Thêm Server mới"
                >
                    <Plus size={22} />
                </button>
            </div>
            <div className="server-rail__item">
                <span className="server-rail__pill"></span>
                <button
                    type="button"
                    className="server-rail__btn server-rail__btn--action"
                    title="Khám phá cộng đồng"
                >
                    <Compass size={22} />
                </button>
            </div>
        </aside>
    );
}
