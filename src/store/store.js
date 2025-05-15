import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { permissionApi } from '../api/permissionApi';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import permissionReducer from '../features/permission/permissionSlice';
import roleReducer from '../features/role/roleSlice';
import { roleApi } from '../api/roleApi';

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
    },
    permission: {
        selectedPermission: null,
    },
    role: {
        selectedRole: null,
        formData: {
            id: '',
            name: '',
            description: '',
        },
    },
};

const token = localStorage.getItem('token') || getCookie('token');
const role = localStorage.getItem('role') || getCookie('role');
const username = localStorage.getItem('username') || getCookie('username');
const id = localStorage.getItem('id') || getCookie('id');

if (token && role && username && id) {
    preloadedState.auth.user = { id, username, role, token };
    preloadedState.auth.isAuthenticated = true;
    console.log('Preloaded Auth State:', preloadedState.auth);
    console.log('Is Authenticated:', preloadedState.auth.isAuthenticated);
    console.log('User:', preloadedState.auth.user);
}

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [permissionApi.reducerPath]: permissionApi.reducer,
        [roleApi.reducerPath]: roleApi.reducer,
        auth: authReducer,
        user: userReducer,
        permission: permissionReducer,
        role: roleReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, permissionApi.middleware, roleApi.middleware),
    preloadedState,
});

setupListeners(store.dispatch);