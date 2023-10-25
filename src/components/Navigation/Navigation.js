import React, { useState, useEffect } from "react";
import DropDownHelpMenu from "./DropDownHelp";
import { Link, useLocation } from "react-router-dom";
import DarkToLight from "../DarkMode/DarkToLight";

import '../../assets/css/Navigation.css'; 

export default function Navigation() {
    let location = useLocation();
    const [pathname, setPathname] = useState("/");
    const [openProfile, setOpenProfile] = useState(false);

    useEffect(() => {
        setPathname(location.pathname)
    }, [location.pathname]);

    return (
        <nav style={{ margin:10 }} className = "nav">
            <Link to="/home" className= {`home ${pathname === "/home" ? `selected` : ``}`} >
                Home
            </Link>
            <Link to="/help" className= {`help ${pathname === "/help" ? `selected` : ``}`} onClick={() => setOpenProfile ((prev) => !prev)}> 
                Help
                {
                    openProfile && <DropDownHelpMenu />
                }
            </Link>
            <Link to="/registration" className= {`registration ${pathname === "/registration" ? `selected` : ``}`} >
                Registration
                <div class="registration-submenu">
                    <Link to="/register" className= {`register ${pathname === "/register" ? `selected` : ``}`} >
                    Register
                    </Link>
                    <Link to="/login" className= {`login ${pathname === "/login" ? `selected` : ``}`} >
                    Login
                    </Link>
                    <Link to="/lostpassword" className= {`lostpassword ${pathname === "/lostpassword" ? `selected` : ``}`} >
                    Lost Password
                    </Link>
                    <Link to="/contactform" className= {`contactform ${pathname === "/contactform" ? `selected` : ``}`} >
                    Contact Form
                    </Link>
                </div>
            </Link>
            <Link to="/snake" className= {`snake ${pathname === "/snake" ? `selected` : ``}`} >
                Snake
            </Link>
            <DarkToLight/>
        </nav>
    )
};
