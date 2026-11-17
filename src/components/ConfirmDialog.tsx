import { createPortal } from 'react-dom';

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