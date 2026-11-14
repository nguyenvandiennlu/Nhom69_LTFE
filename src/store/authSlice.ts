import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    username: string;
    reLoginCode: string;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    username: localStorage.getItem('currentUser') || '',
    reLoginCode: localStorage.getItem('RE_LOGIN_CODE') || '',
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ username: string; reLoginCode: string }>) {
            state.username = action.payload.username;
            state.reLoginCode = action.payload.reLoginCode;
            state.isAuthenticated = true;
        },
        updateCode(state, action: PayloadAction<string>) {
            state.reLoginCode = action.payload;
        },
        setAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
        logout(state) {
            state.username = '';
            state.reLoginCode = '';
            state.isAuthenticated = false;
        },
    },
});

export const { login, updateCode, setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
