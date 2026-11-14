import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
    },
});

let lastHiddenIds = store.getState().chat.hiddenIds;

store.subscribe(() => {
    const { username, reLoginCode } = store.getState().auth;
    if (username) {
        localStorage.setItem('currentUser', username);
        localStorage.setItem('RE_LOGIN_CODE', reLoginCode);
    } else {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('RE_LOGIN_CODE');
    }
    const hiddenIds = store.getState().chat.hiddenIds;
    if (hiddenIds !== lastHiddenIds) {
        lastHiddenIds = hiddenIds;
        if (username) {
            localStorage.setItem('hiddenIds:' + username, JSON.stringify(hiddenIds));
        }
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
