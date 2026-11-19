import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWS } from "../contexts/WebSocketContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";
import { Mic, MicOff, Headphones, HeadphoneOff, LogOut } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

export default function UserProfileBar() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { sendEvent } = useWS();
    const username = useAppSelector((state) => state.auth.username);
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const currentUser = username || 'test1111';

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
        setIsLogoutConfirmOpen(true);
    };
    const handleConfirmLogout = () => {
        setIsLogoutConfirmOpen(false);
        sendEvent('LOGOUT');
        dispatch(logout());
        navigate('/login');
    };

    const handleCancelLogout = () => {
        setIsLogoutConfirmOpen(false);
    };

    return (
        <>
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
        <ConfirmDialog
            isOpen={isLogoutConfirmOpen}
            title="Đăng xuất"
            message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?"
            confirmText="Đăng xuất"
            cancelText="Ở lại"
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
        />
        </>
    );
}
