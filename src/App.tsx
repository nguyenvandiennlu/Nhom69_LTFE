import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import RegisterPage from "./pages/Registerpage.tsx";
import ProtectedRoute from './pages/ProtectedRoute';

export default function App() {
    return (
        <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}