import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    username: string;
    reLoginCode: string;
    login: (username: string, code: string) => void;
    updateCode: (code: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [username, setUsername] = useState(localStorage.getItem('currentUser') || '');
    const [reLoginCode, setReLoginCode] = useState(localStorage.getItem('RE_LOGIN_CODE') || '');

    const login = useCallback((name: string, code: string) => {
        localStorage.setItem('currentUser', name);
        localStorage.setItem('RE_LOGIN_CODE', code);
        setUsername(name);
        setReLoginCode(code);
    }, []);

    // RE_LOGIN trả về code mới mỗi lần nên lưu đè
    const updateCode = useCallback((code: string) => {
        localStorage.setItem('RE_LOGIN_CODE', code);
        setReLoginCode(code);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('RE_LOGIN_CODE');
        setUsername('');
        setReLoginCode('');
    }, []);

    return (
        <AuthContext.Provider value={{ username, reLoginCode, login, updateCode, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider');
    return ctx;
}