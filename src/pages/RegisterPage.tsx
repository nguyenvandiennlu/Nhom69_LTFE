import { Link, Navigate, useNavigate } from "react-router-dom";
import '../styles/login.scss';
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useWS } from "../contexts/WebSocketContext";
import { useAppSelector } from "../store/hooks";
import LoadingOverlay from "../components/LoadingOverlay";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { sendEvent, lastMessage } = useWS();
    const username = useAppSelector((state) => state.auth.username);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [pending, setPending] = useState(false);
    const isSent = useRef(false);

    useEffect(() => {
        if (!isSent.current || lastMessage?.event !== 'REGISTER') return;
        isSent.current = false;
        setPending(false);
        if (lastMessage.status === 'success') {
            window.alert('Đăng ký thành công, bấm OK để sang trang đăng nhập');
            navigate('/login');
        } else if (lastMessage.mes === 'User already exists!') {
            window.alert('Đăng ký không thành công: tên đăng nhập đã tồn tại');
        } else {
            window.alert(lastMessage.mes ?? 'Đăng ký không thành công');
        }
    }, [lastMessage, navigate]);

    useEffect(() => {
        if (!pending) return;
        const timer = setTimeout(() => {
            isSent.current = false;
            setPending(false);
            setRegisterError('Máy chủ không phản hồi, hãy thử lại sau');
        }, 10000);
        return () => clearTimeout(timer);
    }, [pending]);

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (pending) return;
        if (!/^[a-zA-Z0-9_]+$/.test(userName.trim())) {
            setRegisterError('Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới');
            return;
        }
        if (password !== confirmPassword) {
            setRegisterError('Mật khẩu xác nhận không khớp');
            return;
        }
        setPending(true);
        isSent.current = true;
        sendEvent('REGISTER', { user: userName.trim(), pass: password });
    };

    if (username) return <Navigate to="/chat" replace />;

    const inputClass = registerError ? 'form-control inputLogin is-invalid' : 'form-control inputLogin';

    return (
        <div className="login d-flex justify-content-center align-items-center vh-100">
            {pending && <LoadingOverlay message="Đang đăng ký tài khoản..." />}

            <form className="boxLogin" onSubmit={handleRegister}>
                <h3 className="titleLogin">Đăng ký</h3>

                <div className="mb-3">
                    <label className="lableLogin" htmlFor="userName">
                        Tên đăng nhập <span className="starLogin">*</span>
                    </label>
                    <input
                        id="userName"
                        type="text"
                        className={inputClass}
                        value={userName}
                        autoComplete="username"
                        required
                        autoFocus
                        disabled={pending}
                        onChange={(e) => {
                            setUserName(e.target.value);
                            setRegisterError('');
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label className="lableLogin" htmlFor="password">
                        Mật khẩu <span className="starLogin">*</span>
                    </label>
                    <input
                        id="password"
                        type="password"
                        className={inputClass}
                        value={password}
                        autoComplete="new-password"
                        required
                        disabled={pending}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setRegisterError('');
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label className="lableLogin" htmlFor="confirmPassword">
                        Xác nhận mật khẩu <span className="starLogin">*</span>
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className={inputClass}
                        value={confirmPassword}
                        autoComplete="new-password"
                        required
                        disabled={pending}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setRegisterError('');
                        }}
                    />
                    <div className="invalid-feedback">{registerError}</div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary bntLogin w-100"
                    disabled={pending}
                >
                    Đăng ký
                </button>
                <div className="mt-3 text-center">
                    Quay về trang <Link to="/login">Đăng Nhập</Link>
                </div>
            </form>
        </div>
    );
}