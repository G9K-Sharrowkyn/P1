import React, { useState, useEffect } from "react";
import DropDownHelpMenu from "./DropDownHelp";
import { Link, useLocation } from "react-router-dom";
import { defaultRoutes } from '../../Routes';

import '../../assets/css/Navigation.css'; 

export default function Navigation() {
    let location = useLocation();
    const [pathname, setPathname] = useState("/");
    const [openProfile, setOpenProfile] = useState(false);

    useEffect(() => {
        setPathname(location.pathname)
    }, [location.pathname]);

    const handleClick = () => {
        setOpenProfile ((prev) => !prev);
    }

    return (
        <nav style={{ margin:10 }} className = "nav">
            <Link to={defaultRoutes.HOME} className= {`home ${pathname === "/home" ? `selected` : ``}`} >
                Home
            </Link>
            <Link to={defaultRoutes.HELP} className= {`help ${pathname === "/help" ? `selected` : ``}`} onClick={handleClick}> 
                Help
                {
                    openProfile && <DropDownHelpMenu />
                }
            </Link>
            <Link className= {`registration ${pathname === "/registration" ? `selected` : ``}`} >
                Registration
                <div class="registration-submenu">
                    <Link to={defaultRoutes.REGISTER} className= {`register ${pathname === "/register" ? `selected` : ``}`} >
                    Translator
                    </Link>
                    <Link to={defaultRoutes.DOSPAGE} className= {`dospage ${pathname === "/dospage" ? `selected` : ``}`} >
                    Dos
                    </Link>
                    <Link to={defaultRoutes.LOSTPASSWORD} className= {`lostpassword ${pathname === "/lostpassword" ? `selected` : ``}`} >
                    Image Canvas
                    </Link>
                    <Link to={defaultRoutes.CONTACTFORM} className= {`contactform ${pathname === "/contactform" ? `selected` : ``}`} >
                    Contact Form
                    </Link>
                </div>
            </Link>
            <Link to={defaultRoutes.SNAKE} className= {`snake ${pathname === "/snake" ? `selected` : ``}`} >
                Snake
            </Link>
            <Link to={defaultRoutes.LEARNMORE} className= {`learnmore ${pathname === "/learnmore" ? `selected` : ``}`} >
                Star Wars
            </Link>
        </nav>
    )
};
