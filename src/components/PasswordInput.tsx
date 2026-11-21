import { useState, type ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
    id: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    className: string;
    autoComplete: string;
    disabled?: boolean;
}

export default function PasswordInput({ id, value, onChange, className, autoComplete, disabled }: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="passwordLogin">
            <input
                id={id}
                type={visible ? 'text' : 'password'}
                className={className}
                value={value}
                autoComplete={autoComplete}
                required
                disabled={disabled}
                onChange={onChange}
            />
            <button
                type="button"
                className="toggleLogin"
                title={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                aria-pressed={visible}
                disabled={disabled}
                onClick={() => setVisible((prev) => !prev)}
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}