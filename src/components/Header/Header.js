import React from 'react';
import Clock from './Clock';
import DarkToLight from "./DarkToLight";

const Header = () => {
    return (
        <div className="bg-black p-4 shadow-lg border border-gray-300">
            <div className="flex justify-end items-center">
                <div className="mr-4">
                    <DarkToLight />
                </div>
                <div>
                    <Clock/>
                </div>
            </div>
        </div>
    );
}

export default Header;