import { useState, useEffect, useRef } from 'react';
import { Hash, X } from 'lucide-react';
import { useWS } from '../contexts/WebSocketContext';
import { useAppSelector } from '../store/hooks';
import { store } from '../store';
import { normalizeRoomName } from '../services/messageUtils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateRoomModal({ isOpen, onClose }: Props) {
    const [roomName, setRoomName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSubmittingRef = useRef(false);
    const chatAtSubmit = useRef('');
    const sentNameRef = useRef('');

    const { status, sendEvent, lastMessage } = useWS();
    const currentChat = useAppSelector((state) => state.chat.currentChat);

    const handleClose = () => {
        if (isSubmittingRef.current) return;
        setErrorMessage('');
        setRoomName('');
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            setRoomName('');
            setErrorMessage('');
            setIsSubmitting(false);
            isSubmittingRef.current = false;
            chatAtSubmit.current = '';
            sentNameRef.current = '';
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isSubmittingRef.current) {
                handleClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isSubmitting) return;
        if (
            currentChat.type === 'room' &&
            currentChat.name === sentNameRef.current &&
            currentChat.name !== chatAtSubmit.current
        ) {
            isSubmittingRef.current = false;
            sentNameRef.current = '';
            chatAtSubmit.current = '';
            setIsSubmitting(false);
            setErrorMessage('');
            setRoomName('');
            onClose();
        }
    }, [currentChat, isSubmitting, onClose]);

    useEffect(() => {
        if (!isSubmittingRef.current || lastMessage?.event !== 'CREATE_ROOM') return;
        if (lastMessage.status === 'error') {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
            setErrorMessage('Không tạo được phòng. Tên có thể đã tồn tại, thử tên khác.');
        }
    }, [lastMessage]);

    useEffect(() => {
        if (!isSubmitting) return;
        const timer = setTimeout(() => {
            if (!isSubmittingRef.current) return;
            const exists = store.getState().chat.chats.some(
                (c) => c.type === 'room' && c.name === sentNameRef.current
            );
            if (exists) {
                isSubmittingRef.current = false;
                sentNameRef.current = '';
                chatAtSubmit.current = '';
                setIsSubmitting(false);
                setErrorMessage('');
                setRoomName('');
                onClose();
                return;
            }
            isSubmittingRef.current = false;
            setIsSubmitting(false);
            setErrorMessage('Máy chủ không phản hồi, vui lòng thử lại sau.');
        }, 10000);
        return () => clearTimeout(timer);
    }, [isSubmitting, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        const trimmed = normalizeRoomName(roomName);
        if (!trimmed) {
            setErrorMessage('Tên kênh không được để trống.');
            return;
        }

        if (status !== 'open') {
            setErrorMessage('Chưa kết nối được tới máy chủ.');
            return;
        }

        setErrorMessage('');
        setIsSubmitting(true);
        isSubmittingRef.current = true;
        chatAtSubmit.current = currentChat.name;
        sentNameRef.current = trimmed;
        sendEvent('CREATE_ROOM', { name: trimmed });
    };

    return (
        <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1050 }}
            onClick={handleClose}
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
                        onClick={handleClose}
                        disabled={isSubmitting}
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
                                placeholder="kênh mới"
                                autoFocus
                                value={roomName}
                                disabled={isSubmitting}
                                onChange={(e) => {
                                    setRoomName(e.target.value);
                                    setErrorMessage('');
                                }}
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-danger mt-2 fw-medium" style={{ fontSize: '13px' }}>
                                {errorMessage}
                            </div>
                        )}
                    </div>

                    <div 
                        className="d-flex align-items-center justify-content-end gap-2 p-3"
                        style={{ backgroundColor: '#2b2d31' }}
                    >
                        <button 
                            type="button" 
                            className="btn btn-link text-white text-decoration-none px-3"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary px-4 fw-medium"
                            style={{ backgroundColor: '#5865f2', borderColor: '#5865f2' }}
                            disabled={!roomName.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo kênh'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
