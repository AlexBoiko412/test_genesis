import { AppDispatch } from "../../store";
import { authSlice } from "./AuthSlice";
import axios, { AxiosError } from "axios";

interface TokenResponse {
    token: string;
}

export const fetchToken = () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(authSlice.actions.fetchToken());

            const response = await axios.get<TokenResponse>(
                "https://api.wisey.app/api/v1/auth/anonymous?platform=subscriptions"
            );

            const token = response.data.token;

            if (token) {
                document.cookie = `token=${token}; max-age=36000`;
                dispatch(authSlice.actions.fetchTokenSuccess(token));
            } else {
                dispatch(authSlice.actions.fetchTokenError("Unauthorized"));
            }
        } catch (e: any) {
            console.log(e)
            if (e.response.data.message) {
                dispatch(
                    authSlice.actions.fetchTokenError(e.response.data.message)
                )
            } else {
                dispatch(authSlice.actions.fetchTokenError("Network Error"))
            }
        }
    };
};