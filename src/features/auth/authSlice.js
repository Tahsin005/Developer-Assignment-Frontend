import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    success: false,
    isAuthenticated: false,
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSuccess: (state, action) => {
            state.success = action.payload;
        },
        resetAuthState: (state) => {
            state.success = false;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload?.token;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.success = false;
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
    }
});

export const selectIsSystemAdmin = (state) => {
    state.auth.user?.role === 'system_admin';
}
export const selectIsAdminOrHigher = (state) => ['admin', 'system_admin'].includes(state.auth.user?.role);
export const selectIsModeratorOrHigher = (state) => ['moderator', 'admin', 'system_admin'].includes(state.auth.user?.role);
export const selectIsUser = (state) => state.auth.user?.role === 'user';
export const selectUserId = (state) => state.auth.user?.id;

export const { setSuccess, resetAuthState, logout, setUser } = authSlice.actions;
export default authSlice.reducer;