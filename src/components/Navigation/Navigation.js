import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import '../../assets/Navigation.css'; 


export default function Navigation() {
    let location = useLocation();
    const [pathname, setPathname] = useState("/");
    React.useEffect(() => {
        setPathname(location.pathname)
      }, [location.pathname]);

    return (
        <nav style={{ margin:10 }} className = "nav">
            <Link to="/home" className= {`home ${pathname === "/home" ? `selected` : ``}`} >
                Home
            </Link>
            <Link to="/help" className= {`help ${pathname === "/help" ? `selected` : ``}`} >
                Help
                <div class="help-submenu">
                <Link to="/chat" className= {`chat ${pathname === "/chat" ? `selected` : ``}`} >
                Chat
                </Link>
                <Link to="/facebook" className= {`facebook ${pathname === "/facebook" ? `selected` : ``}`} >
                Facebook
                </Link>
                <Link to="/discord" className= {`discord ${pathname === "/discord" ? `selected` : ``}`} >
                Discord
                </Link>
                <Link to="/rules" className= {`rules ${pathname === "/rules" ? `selected` : ``}`} >
                Rules
                </Link>
                </div>
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
        </nav>
    )
};
