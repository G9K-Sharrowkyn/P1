import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { defaultRoutes } from '../../Routes';

import '../../assets/css/Help.css'; 

export default function DropDownHelpMenu() {

    let location = useLocation();
    const [pathname, setPathname] = useState("/");

    useEffect(() => {
        setPathname(location.pathname)
    }, [location.pathname]);

    return (
        <div className="flex flex-col">
            <ul className="flex flex-col gap-4">
            <div class="help-submenu">
            <Link to={defaultRoutes.CHAT} className= {`chat ${pathname === "/chat" ? `selected` : ``}`} >
                Chat
            </Link>
            <Link to={defaultRoutes.FACEBOOK} className= {`facebook ${pathname === "/facebook" ? `selected` : ``}`} >
                Facebook
            </Link>
            <Link to={defaultRoutes.DISCORD} className= {`discord ${pathname === "/discord" ? `selected` : ``}`} >
                ImagePopUp
            </Link>
            <Link to={defaultRoutes.RULES} className= {`rules ${pathname === "/rules" ? `selected` : ``}`} >
                Map
            </Link>
                </div>
            </ul>
        </div>
    )
}
