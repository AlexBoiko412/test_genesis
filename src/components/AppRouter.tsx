import React, {FC} from 'react';
import {Route, Routes} from "react-router";
import Layout from "./Layout";
import Courses from "../pages/Courses";
import Course from "../pages/Course";

const AppRouter: FC = () => {


    return (
        <Routes>
            <Route path="" element={<Layout/>}>
                <Route index element={<Courses/>}/>
                <Route path={"/:id"} element={<Course/>}/>
            </Route>
        </Routes>
    );
};

export default AppRouter;