import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useWS } from '../contexts/WebSocketContext';
import LoadingOverlay from '../components/LoadingOverlay';

const CONNECTION_TIMEOUT = 10_000;

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useWS();
    const hasSession = !!localStorage.getItem('currentUser');
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (isAuthenticated || !hasSession) return;
        setTimedOut(false);
        const timer = setTimeout(() => setTimedOut(true), CONNECTION_TIMEOUT);
        return () => clearTimeout(timer);
    }, [isAuthenticated, hasSession]);

    // ko có session trong localStorage → ve trang dang nhap
    if (!hasSession) return <Navigate to="/login" replace />;

    // Co session nhung chua xac thuc xong
    if (!isAuthenticated) {
        if (timedOut) {
            return (
                <div
                    className="loading-overlay"
                    role="alert"
                    style={{ cursor: 'default' }}
                >
                    <span className="loading-overlay__text">
                        Không kết nối được tới máy chủ
                    </span>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Thử lại
                        </button>
                        <button
                            className="btn btn-outline-light"
                            onClick={() => {
                                localStorage.removeItem('currentUser');
                                localStorage.removeItem('RE_LOGIN_CODE');
                                window.location.href = '/login';
                            }}
                        >
                            Về trang đăng nhập
                        </button>
                    </div>
                </div>
            );
        }
        return <LoadingOverlay message="Đang đăng nhập lại..." />;
    }

    // Da  xac thuc  tu dong chuyen qua trang /chat
    return <>{children}</>;
}
