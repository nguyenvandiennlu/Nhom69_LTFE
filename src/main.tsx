import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './styles/main.scss';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HashRouter>
            <AuthProvider>
                <WebSocketProvider>
                    <App />
                </WebSocketProvider>
            </AuthProvider>
        </HashRouter>
    </StrictMode>
);
