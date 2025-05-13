import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        success: false,
    },
    reducers: {
        setSuccess: (state, action) => {
            state.success = action.payload;
        },
        resetAuthState: (state) => {
            state.success = false;
        }
    }
});

export const { setSuccess, resetAuthState } = authSlice.actions;
export default authSlice.reducer;