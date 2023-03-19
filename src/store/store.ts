import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {courseAPI} from "../services/CourseService";
import {authSlice} from "./reducers/AuthSlice/AuthSlice";


const rootReducer = combineReducers({
    [courseAPI.reducerPath]: courseAPI.reducer,
    authSlice: authSlice.reducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(courseAPI.middleware)
        }
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]


