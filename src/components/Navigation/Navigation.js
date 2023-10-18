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
        </nav>
    )
};
