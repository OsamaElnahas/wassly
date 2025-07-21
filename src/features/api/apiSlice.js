// src/features/api/apiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    onProduction: true,
};

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {
        setProductionMode: (state, action) => {
            state.onProduction = action.payload;
        },
    },
});

export const { setProductionMode } = apiSlice.actions;
export default apiSlice.reducer;

export const selectBaseUrl = (state) =>
    state.api.onProduction ?
    'https://wassally.onrender.com/' :
    'https://wassally-test-server.fly.dev/';