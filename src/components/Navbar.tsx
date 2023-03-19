import React, {FC} from 'react';
import {Header} from "antd/es/layout/layout";
import {useNavigate} from "react-router";

const Navbar: FC = () => {
    const navigate = useNavigate()

    return (
        <Header>
            <p
                className={"homeLink"}
                onClick={(e) => {
                    navigate("/")
                }}
            >
                Home
            </p>
        </Header>
    );
};

export default Navbar;