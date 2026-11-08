import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useWS } from '../contexts/WebSocketContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const CONNECTION_TIMEOUT = 10_000;

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useWS();
    const { username } = useAuth();
    const hasSession = !!username || !!localStorage.getItem('currentUser');
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (isAuthenticated || !hasSession) return;
        setTimedOut(false);
        const timer = setTimeout(() => setTimedOut(true), CONNECTION_TIMEOUT);
        return () => clearTimeout(timer);
    }, [isAuthenticated, hasSession]);

    // ko có session trong localStorage / AuthContext tu quay ve /login
    if (!hasSession) return <Navigate to="/login" replace />;

    // Co session nhung  bat buoc phai xac thuc moi cho vo
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

    // da xac thuc thi tu dong vo /chat
    return <>{children}</>;
}
