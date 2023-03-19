import {AuthState} from "./types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: AuthState = {
    token: "",
    error: "",
    isLoading: false
}

export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        fetchToken(state) {
            state.isLoading = true
        },
        fetchTokenSuccess(state, action: PayloadAction<string>) {
            state.token = action.payload
            state.isLoading = false
        },
        fetchTokenError(state, action: PayloadAction<string>) {
            state.error = action.payload
            state.isLoading = false
        },

    }
})