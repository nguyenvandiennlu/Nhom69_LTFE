import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { store } from './store';
import { WebSocketProvider } from './contexts/WebSocketContext';
import App from './App';
import './styles/main.scss';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <HashRouter>
                <WebSocketProvider>
                    <App />
                </WebSocketProvider>
            </HashRouter>
        </Provider>
    </StrictMode>
);
