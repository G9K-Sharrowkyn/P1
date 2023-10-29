import React from 'react';
import Clock from './Clock';
import DarkToLight from "./DarkToLight";

import '../../assets/css/Header.css';


const Header = () => {

    return (
        <div className="headerBanner clearfix">
            <Clock/>
            <DarkToLight/>
        </div>
    );
}

export default Header;
