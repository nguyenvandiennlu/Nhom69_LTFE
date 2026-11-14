import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Đồng bộ auth state xuống localStorage
// Reducer là hàm thuần, không ghi localStorage trong đó
store.subscribe(() => {
    const { username, reLoginCode } = store.getState().auth;
    if (username) {
        localStorage.setItem('currentUser', username);
        localStorage.setItem('RE_LOGIN_CODE', reLoginCode);
    } else {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('RE_LOGIN_CODE');
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
