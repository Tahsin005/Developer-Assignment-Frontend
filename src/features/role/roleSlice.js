import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedRole: null,
    formData: {
        id: '',
        name: '',
        description: '',
    },
}

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setSelectedRole: (state, action) => {
            state.selectedRole = action.payload;
            state.formData = { ...action.payload };
        },
        clearSelectedRole: (state) => {
            state.selectedRole = null;
            state.formData = { id: '', name: '', description: '' };
        },
        updateFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
    },
});

export const { setSelectedRole, clearSelectedRole, updateFormData } = roleSlice.actions;
export default roleSlice.reducer;