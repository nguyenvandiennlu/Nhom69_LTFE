import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ isOpen, title, message, confirmText = 'Đồng ý', cancelText = 'Hủy', onConfirm, onCancel, }: Props) {
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (isOpen) {
            confirmButtonRef.current?.focus();
        }
    }, [isOpen]);
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCancel();
            }
            if (event.key === 'Enter') {
                event.preventDefault();
                onConfirm();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onConfirm, onCancel]);
    if (!isOpen) return null;
    return createPortal(
        <div className="confirm-dialog" onClick={onCancel}>
            <div className="confirm-dialog__box" onClick={(e) => e.stopPropagation()}>
                <h5 className="confirm-dialog__title">{title}</h5>
                <p className="confirm-dialog__message">{message}</p>
                <div className="confirm-dialog__actions">
                    <button className="btn btn-link text-white text-decoration-none" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="btn btn-primary" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}