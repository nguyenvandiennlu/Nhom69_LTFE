import { useState, useEffect } from 'react';
import { Hash, X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreateRoom: (roomName: string) => void;
}

export default function CreateRoomModal({ isOpen, onClose, onCreateRoom }: Props) {
    const [roomName, setRoomName] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = roomName.trim().replace(/\s+/g, '-').toLowerCase();
        if (!trimmed) return;
        onCreateRoom(trimmed);
        setRoomName('');
        onClose();
    };

    return (
        <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1050 }}
            onClick={onClose}
        >
            <div 
                className="rounded-3 overflow-hidden"
                style={{ 
                    width: '440px', 
                    maxWidth: '90vw', 
                    backgroundColor: '#313338', 
                    color: '#dbdee1',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)' 
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="d-flex align-items-center justify-content-between p-3 pb-2">
                    <h5 className="m-0 fw-bold text-white">Tạo kênh trò chuyện</h5>
                    <button 
                        type="button" 
                        className="btn btn-link text-secondary p-0 text-decoration-none"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-3 pt-1">
                        <label className="d-block text-uppercase fw-bold mb-2" style={{ fontSize: '12px', color: '#b5bac1' }}>
                            Tên kênh
                        </label>
                        <div 
                            className="d-flex align-items-center rounded-2 px-2"
                            style={{ backgroundColor: '#1e1f22', border: '1px solid rgba(0,0,0,0.3)' }}
                        >
                            <Hash size={18} className="text-secondary me-2" />
                            <input 
                                type="text"
                                className="form-control bg-transparent border-0 text-white shadow-none px-0"
                                placeholder="kênh-mới"
                                autoFocus
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div 
                        className="d-flex align-items-center justify-content-end gap-2 p-3"
                        style={{ backgroundColor: '#2b2d31' }}
                    >
                        <button 
                            type="button" 
                            className="btn btn-link text-white text-decoration-none px-3"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary px-4 fw-medium"
                            style={{ backgroundColor: '#5865f2', borderColor: '#5865f2' }}
                            disabled={!roomName.trim()}
                        >
                            Tạo kênh
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
