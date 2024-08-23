import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoading: true,
    verified: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      loginUser: (state, action) => {
        state.user = action.payload;
      },
        logoutUser: (state) => {
            state.user = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setVerified: (state, action) => {
            state.verified = action.payload;
        },
    },
});

export const { loginUser, logoutUser, setLoading, setVerified } = userSlice.actions;