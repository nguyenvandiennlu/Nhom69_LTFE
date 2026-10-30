import {useNavigate} from "react-router-dom";
import '../styles/login.scss';
import {type FormEvent, useState} from "react";

//acc test
const TEMP_USER = 'test';
const TEMP_PASSWORD = 'test';

export default function LoginPage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userName.trim() !== TEMP_USER || password !== TEMP_PASSWORD) {
            setLoginError('Tên đăng nhập hoặc mật khẩu không đúng');
            return;
        }
        navigate('/chat');
    };
    const inputClass = loginError ? 'form-control inputLogin is-invalid' : 'form-control inputLogin';

    return (
        <div className="login d-flex justify-content-center align-items-center vh-100">
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
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setLoginError('');
                        }}
                    />
                    <div className="invalid-feedback">{loginError}</div>
                </div>

                <button type="submit" className="btn btn-primary bntLogin w-100">Đăng nhập</button>
            </form>
        </div>
    );
}