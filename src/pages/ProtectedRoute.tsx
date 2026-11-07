import {Navigate} from "react-router-dom";
import type {ReactNode} from "react";
import {useAuth} from "../contexts/AuthContext";

// Chưa đăng nhập thì đưa về trang đăng nhập
export default function ProtectedRoute({children}: {children: ReactNode}) {
    const {username} = useAuth();
    if (!username) return <Navigate to="/login" replace />;
    return <>{children}</>;
}