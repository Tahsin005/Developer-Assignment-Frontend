import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import authReducer from '../features/auth/authSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const preloadedState = {
    auth: {
        user: null,
        success: false,
        isAuthenticated: false,
    }
};

const token = localStorage.getItem('token') || getCookie('token');
const role = localStorage.getItem('role') || getCookie('role');
const username = localStorage.getItem('username') || getCookie('username');
const id = localStorage.getItem('id') || getCookie('id');

if (token && role && username && id) {
    preloadedState.auth.user = { id, username, role, token };
    preloadedState.auth.isAuthenticated = true;
    console.log(preloadedState.auth)
    console.log(preloadedState.auth.isAuthenticated)
    console.log(preloadedState.auth.user)
}

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
    preloadedState,
});

setupListeners(store.dispatch);