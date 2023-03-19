import React, {FC} from 'react';
import Navbar from "./Navbar";
import {Outlet} from "react-router";

const Layout: FC = () => {


    return (
        <div>
            <Navbar/>
            <div className="app__content">
                <Outlet/>
            </div>
        </div>
    );
};

export default Layout;