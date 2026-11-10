import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWS } from "../contexts/WebSocketContext";
import { useAuth } from "../contexts/AuthContext";
import { Mic, MicOff, Headphones, HeadphoneOff, LogOut } from "lucide-react";

export default function UserProfileBar() {
    const navigate = useNavigate();
    const { sendEvent } = useWS();
    const { logout } = useAuth();
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

    const currentUser = localStorage.getItem('currentUser') || 'test1111';

    const toggleMic = () => {
        setIsMuted(!isMuted);
    };

    const toggleDeafen = () => {
        if (!isDeafened) {
            setIsDeafened(true);
            setIsMuted(true);
        } else {
            setIsDeafened(false);
            setIsMuted(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
            sendEvent('LOGOUT');
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="sidebar__user-bar">
            <div className="sidebar__user-profile" data-tooltip="Tài khoản của bạn">
                <div className="sidebar__avatar">
                    {currentUser.charAt(0).toUpperCase()}
                    <span className="sidebar__avatar-dot"></span>
                </div>
                <div>
                    <div className="sidebar__user-name text-truncate" style={{ maxWidth: '85px' }}>
                        {currentUser}
                    </div>
                    <div className="sidebar__user-status">#Online</div>
                </div>
            </div>

            <div className="sidebar__actions">
                <button
                    type="button"
                    className="sidebar__action-btn"
                    data-tooltip={isMuted ? "Bật Mic" : "Tắt Mic"}
                    onClick={toggleMic}
                >
                    {isMuted ? <MicOff size={18} color="#f23f43" /> : <Mic size={18} />}
                </button>
                <button
                    type="button"
                    className="sidebar__action-btn"
                    data-tooltip={isDeafened ? "Bật âm thanh" : "Tắt âm thanh"}
                    onClick={toggleDeafen}
                >
                    {isDeafened ? <HeadphoneOff size={18} color="#f23f43" /> : <Headphones size={18} />}
                </button>
                <button
                    type="button"
                    className="sidebar__action-btn sidebar__action-btn--logout"
                    data-tooltip="Đăng xuất"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
}
