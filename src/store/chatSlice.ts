import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Message, CurrentChat } from '../types/message';
import { logout } from './authSlice';

export interface ChatState {
    messagesByChat: Record<string, Message[]>;
    currentChat: CurrentChat;
    chats: CurrentChat[];
    showFriends: boolean;
    onlineMap: Record<string, boolean>;
    roomInfo: Record<string, { own: string; users: { id: number; name: string }[] }>;
    addError: string;
    pendingHistoryQueue: string[];
    hiddenIds: string[];
}

const initialState: ChatState = {
    messagesByChat: {},
    currentChat: { name: 'chat-chung', type: 'room' },
    chats: [],
    showFriends: true,
    onlineMap: {},
    roomInfo: {},
    addError: '',
    pendingHistoryQueue: [],
    hiddenIds: [],
};

export const EMPTY_MESSAGES: Message[] = [];

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        pushHistoryQueue(state, action: PayloadAction<string>) {
            state.pendingHistoryQueue.push(action.payload);
        },
        shiftHistoryQueue(state) {
            state.pendingHistoryQueue.shift();
        },
        addMessage(state, action: PayloadAction<{ message: Message; currentUsername: string }>) {
            const { message: msg, currentUsername } = action.payload;
            let key = '';
            if (msg.type === 1) {
                key = `room:${msg.to ?? ''}`;
            } else {
                key = msg.user === currentUsername ? `people:${msg.to ?? ''}` : `people:${msg.user}`;
            }

            if (!key || key === 'room:' || key === 'people:') return;
            if (state.hiddenIds.includes(msg.id)) return;

            if (!state.messagesByChat[key]) {
                state.messagesByChat[key] = [];
            }

            const exists = state.messagesByChat[key].some((m) => m.id === msg.id);
            if (!exists) {
                state.messagesByChat[key].push(msg);
            }
        },
        setHistory(state, action: PayloadAction<{ key: string; history: Message[]; page?: number }>) {
            const { key, history, page = 1 } = action.payload;
            if (!key) return;
            const visible = history.filter((m) => !state.hiddenIds.includes(m.id));

            const current = state.messagesByChat[key] ?? [];
            const map = new Map<string, Message>();

            if (page > 1) {
                visible.forEach((m) => map.set(m.id, m));
                current.forEach((m) => map.set(m.id, m));
            } else {
                visible.forEach((m) => map.set(m.id, m));
                history.forEach((m) => map.set(m.id, m));
            }

            const merged = Array.from(map.values()).sort((a, b) => (a.time < b.time ? -1 : 1));
            state.messagesByChat[key] = merged;
        },
        deleteMessage(state, action: PayloadAction<{ key: string; id: string }>) {
            const { key, id } = action.payload;
            if (state.messagesByChat[key]) {
                state.messagesByChat[key] = state.messagesByChat[key].filter((m) => m.id !== id);
            }
        },
        hideMessage(state, action: PayloadAction<{ key: string; id: string }>) {
            const { key, id } = action.payload;
            if (!state.hiddenIds.includes(id)) {
                state.hiddenIds.push(id);
            }
            if (state.messagesByChat[key]) {
                state.messagesByChat[key] = state.messagesByChat[key].filter((m) => m.id !== id);
            }
        },
        setHiddenIds(state, action: PayloadAction<string[]>) {
            state.hiddenIds = action.payload;
        },
        setChats(state, action: PayloadAction<CurrentChat[]>) {
            state.chats = action.payload;
        },
        addChat(state, action: PayloadAction<CurrentChat>) {
            const exists = state.chats.some(
                (c) => c.name === action.payload.name && c.type === action.payload.type
            );
            if (!exists) {
                state.chats.push(action.payload);
            }
        },
        setCurrentChat(state, action: PayloadAction<CurrentChat>) {
            state.currentChat = action.payload;
            state.showFriends = false;
        },
        setShowFriends(state, action: PayloadAction<boolean>) {
            state.showFriends = action.payload;
        },
        setOnlineStatus(state, action: PayloadAction<{ user: string; status: boolean }>) {
            state.onlineMap[action.payload.user] = action.payload.status;
        },
        setRoomInfo(
            state,
            action: PayloadAction<{ roomName: string; own: string; users: { id: number; name: string }[] }>
        ) {
            state.roomInfo[action.payload.roomName] = {
                own: action.payload.own,
                users: action.payload.users,
            };
        },
        setAddError(state, action: PayloadAction<string>) {
            state.addError = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, () => initialState);
    },
});

export const {
    pushHistoryQueue,
    shiftHistoryQueue,
    addMessage,
    setHistory,
    deleteMessage,
    setChats,
    addChat,
    setCurrentChat,
    setShowFriends,
    setOnlineStatus,
    setRoomInfo,
    setAddError,
    hideMessage,
    setHiddenIds,
} = chatSlice.actions;

export default chatSlice.reducer;
