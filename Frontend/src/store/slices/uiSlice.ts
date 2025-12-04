import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// ============= Types =============

export interface UIState {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    notifications: Notification[];
    isLoading: boolean;
    modal: {
        isOpen: boolean;
        title: string;
        content: string;
    } | null;
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

// ============= Initial State =============

const initialState: UIState = {
    theme: 'light',
    sidebarOpen: true,
    notifications: [],
    isLoading: false,
    modal: null,
};

// ============= Slice =============

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (notif) => notif.id !== action.payload
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        openModal: (
            state,
            action: PayloadAction<{ title: string; content: string }>
        ) => {
            state.modal = {
                isOpen: true,
                title: action.payload.title,
                content: action.payload.content,
            };
        },
        closeModal: (state) => {
            state.modal = null;
        },
    },
});

export const {
    setTheme,
    toggleTheme,
    toggleSidebar,
    setSidebarOpen,
    addNotification,
    removeNotification,
    clearNotifications,
    setLoading,
    openModal,
    closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
