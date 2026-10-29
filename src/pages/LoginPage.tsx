import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function LoginPage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleLogin = () =>{
        let valid = true;
        if (!userName.trim()) {
            setUserNameError('Tên đăng nhập không được để trống');
            valid = false;
        }else {
            setUserNameError('');
        }
        if (!password.trim()){
            setPasswordError('Mật khẩu không được để trống ');
            valid = false;
        } else {
            setPasswordError('');
        }
        if (!valid) return;
        navigate('/chat');
    };
    return <>
    <h2>Đăng nhập</h2>
    <input value={userName}
           onChange={(e) => setUserName(e.target.value)}
            placeholder="Tên đăng nhập"
    />
        <p>{userNameError}</p>
    <input value={password}
           onChange={(e) => setPassword(e.target.value)}
           onKeyDown={(e) =>e.key === 'Enter' && handleLogin()}
           placeholder="Mật khẩu"
    />
        <p>{passwordError}</p>
    <button onClick={handleLogin}>Đăng nhập</button>
    </>
}