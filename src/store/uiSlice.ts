import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction} from '@reduxjs/toolkit';

export interface Toast {
    id: string;
    message: string;
}
interface UiState {
    toasts: Toast[];
}
const initialState: UiState = {
    toasts: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showToast: {
            reducer(state, action: PayloadAction<Toast>) {
                const isDuplicate = state.toasts.some((t) => t.message === action.payload.message);
                if (isDuplicate) return;
                state.toasts.push(action.payload);
                if (state.toasts.length > 3) {
                    state.toasts.shift();
                }
            },
            prepare(message: string) {
                return { payload: { id: crypto.randomUUID(), message } };
            },
        },
        removeToast(state, action: PayloadAction<string>) {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
    },
});

export const { showToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;