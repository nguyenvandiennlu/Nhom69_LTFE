import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { AuthProvider } from './contexts/AuthContext.tsx';
import App from './App';
import './styles/main.scss';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <WebSocketProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </WebSocketProvider>
        </BrowserRouter>
    </StrictMode>
);
