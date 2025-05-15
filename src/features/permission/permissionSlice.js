import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedPermission: null,
}

const permissionSlice = createSlice({
    name: "permission",
    initialState,
    reducers: {
        setSelectedPermission: (state, action) => {
            state.selectedPermission = action.payload;
        },
        clearSelectedPermission: (state) => {
            state.selectedPermission = null;
        },
    },
});

export const { setSelectedPermission, clearSelectedPermission } = permissionSlice.actions;
export default permissionSlice.reducer;