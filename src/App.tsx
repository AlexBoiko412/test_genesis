import React, {useEffect} from 'react';
import AppRouter from "./components/AppRouter";
import {useAppDispatch} from "./hooks/redux";
import {fetchToken} from "./store/reducers/AuthSlice/actionCreators";
import {authSlice} from "./store/reducers/AuthSlice/AuthSlice";
import {getValueCookieByKey} from "./utils/getValueCookieByKey";
import {HashRouter} from "react-router-dom";

function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const token = getValueCookieByKey("token")

        if(token) {
            dispatch(authSlice.actions.fetchTokenSuccess(token))
        } else {
            dispatch(fetchToken())
        }
    }, [])


    return (
        <div className="app">
            <HashRouter>
                <AppRouter/>
            </HashRouter>
        </div>
);
}

export default App;
