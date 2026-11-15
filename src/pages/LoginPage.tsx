import { Link, Navigate, useNavigate } from "react-router-dom";
import '../styles/login.scss';
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useWS } from "../contexts/WebSocketContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../store/authSlice";
import LoadingOverlay from "../components/LoadingOverlay";

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { status, sendEvent, lastMessage } = useWS();
    const username = useAppSelector((state) => state.auth.username);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [pending, setPending] = useState(false);
    const sentUser = useRef('');

    useEffect(() => {
        if (!sentUser.current || lastMessage?.event !== 'LOGIN') return;
        const user = sentUser.current;
        sentUser.current = '';
        setPending(false);
        if (lastMessage.status === 'success') {
            const data = lastMessage.data as { RE_LOGIN_CODE: string };
            dispatch(login({ username: user, reLoginCode: data.RE_LOGIN_CODE }));
            navigate('/chat');
        } else {
            setLoginError('Tên đăng nhập hoặc mật khẩu không đúng');
        }
    }, [lastMessage, navigate, dispatch]);

    useEffect(() => {
        if (!pending) return;
        const timer = setTimeout(() => {
            sentUser.current = '';
            setPending(false);
            setLoginError('Máy chủ không phản hồi, hãy thử lại sau');
        }, 10000);
        return () => clearTimeout(timer);
    }, [pending]);

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (pending) return;
        if (status !== 'open') {
            setLoginError('Chưa kết nối được tới server');
            return;
        }
        setPending(true);
        sentUser.current = userName.trim();
        sendEvent('LOGIN', { user: userName.trim(), pass: password });
    };

    if (username) return <Navigate to="/chat" replace />;

    const inputClass = loginError ? 'form-control inputLogin is-invalid' : 'form-control inputLogin';

    return (
        <div className="login d-flex justify-content-center align-items-center vh-100">
            {pending && <LoadingOverlay message="Đang đăng nhập..." />}

            <form className="boxLogin" onSubmit={handleLogin}>
                <h3 className="titleLogin">Đăng nhập</h3>

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
                            setLoginError('');
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
                        autoComplete="current-password"
                        required
                        disabled={pending}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setLoginError('');
                        }}
                    />
                    <div className="invalid-feedback">{loginError}</div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary bntLogin w-100"
                    disabled={pending}
                >
                    Đăng nhập
                </button>
                <div className="mt-3 text-center">
                    Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                </div>
            </form>
        </div>
    );
}