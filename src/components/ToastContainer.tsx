import { useEffect} from 'react';
import { X} from 'lucide-react';
import { useAppDispatch, useAppSelector} from '../store/hooks';
import { removeToast} from '../store/uiSlice';
import type { Toast} from '../store/uiSlice';

function ToastItem({ toast }: { toast: Toast }) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const timer = setTimeout(() => dispatch(removeToast(toast.id)), 4000);
        return () => clearTimeout(timer);
    }, [toast.id, dispatch]);

    return (
        <div className="app-toast">
            <span className="app-toast__message">{toast.message}</span>
            <button className="app-toast__close" onClick={() => dispatch(removeToast(toast.id))}>
                <X size={16} />
            </button>
        </div>
    );
}

export default function ToastContainer() {
    const toasts = useAppSelector((s) => s.ui.toasts);
    return (
        <div className="app-toasts" role="status" aria-live="polite">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} />
            ))}
        </div>
    );
}