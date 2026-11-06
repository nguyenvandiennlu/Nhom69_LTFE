import {Link, useNavigate} from "react-router-dom";
import '../styles/login.scss';
import {type FormEvent, useEffect, useRef, useState} from "react";
import {useWS} from "../contexts/WebSocketContext";

export default function RegisterPage() {
    const navigate = useNavigate();
    const {sendEvent, lastMessage} = useWS();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const isSent = useRef(false);

    useEffect(() => {
        if (!isSent.current || lastMessage?.event !== 'REGISTER') return;
        isSent.current = false;
        if (lastMessage.status === 'success') {
            window.alert('Đăng ký thành công, bấm OK để sang trang Đăng Nhập');
            navigate('/login');
        } else if (lastMessage.mes === 'User already exists!') {
            window.alert('Đăng ký không thành công: tên đăng nhập đã tồn tại');
        } else {
            window.alert(lastMessage.mes ?? 'Đăng ký không thành công');
        }
    }, [lastMessage, navigate]);

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!/^[a-zA-Z0-9_]+$/.test(userName.trim())) {
            setRegisterError('Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới');
            return;
        }
        if (password !== confirmPassword) {
            setRegisterError('Mật khẩu xác nhận không khớp');
            return;
        }
        isSent.current = true;
        sendEvent('REGISTER', {user: userName.trim(), pass: password});
    };
    const inputClass = registerError ? 'form-control inputLogin is-invalid' : 'form-control inputLogin';

    return (
        <div className="login d-flex justify-content-center align-items-center vh-100">
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
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setRegisterError('');
                        }}
                    />
                    <div className="invalid-feedback">{registerError}</div>
                </div>

                <button type="submit" className="btn btn-primary bntLogin w-100">Đăng ký</button>
                <div className="mt-3 text-center">
                    Quay về trang <Link to="/login">Đăng Nhập</Link>
                </div>
            </form>
        </div>
    );
}