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
            <Link to="/chat" className= {`chat ${pathname === "/chat" ? `selected` : ``}`} >
                Chat
            </Link>
            <Link to="/home" className= {`home ${pathname === "/home" ? `selected` : ``}`} >
                Home
            </Link>
            <Link to="/about" className= {`about ${pathname === "/about" ? `selected` : ``}`} >
                About
            </Link>
            <Link to="/facebook" className= {`facebook ${pathname === "/facebook" ? `selected` : ``}`} >
                Facebook
            </Link>
            <Link to="/discord" className= {`discord ${pathname === "/discord" ? `selected` : ``}`} >
                Discord
            </Link>
            <Link to="/registration" className= {`registration ${pathname === "/registration" ? `selected` : ``}`} >
                Registration
                <div class="submenu">
                    <Link to="/subpage1">Subpage 1</Link>
                    <Link to="/subpage2">Subpage 2</Link>
                    <Link to="/subpage3">Subpage 3</Link>
                </div>
            </Link>
            <Link to="/rules" className= {`rules ${pathname === "/rules" ? `selected` : ``}`} >
                Rules
            </Link>
            <Link to="/snake" className= {`snake ${pathname === "/snake" ? `selected` : ``}`} >
                Snake
            </Link>
        </nav>
    )
};
