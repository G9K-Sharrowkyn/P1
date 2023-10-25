import React from "react";
import { Link } from "react-router-dom";

const DropDownHelpMenu = () => {
    return (
        <div className="flex flex-col">
            <ul className="flex flex-col gap-4">
            <div class="help-submenu">
                <Link to="/chat" className= {`chat ${DropDownHelpMenu === "/chat" ? `selected` : ``}`} >
                Chat
                </Link>
                <Link to="/facebook" className= {`facebook ${DropDownHelpMenu === "/facebook" ? `selected` : ``}`} >
                Facebook
                </Link>
                <Link to="/discord" className= {`discord ${DropDownHelpMenu === "/discord" ? `selected` : ``}`} >
                Discord
                </Link>
                <Link to="/rules" className= {`rules ${DropDownHelpMenu === "/rules" ? `selected` : ``}`} >
                Rules
                </Link>
                </div>
            </ul>
        </div>
    )
}

export default DropDownHelpMenu
