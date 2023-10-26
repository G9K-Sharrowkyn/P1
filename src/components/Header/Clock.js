import React, { useEffect, useState } from "react";
import '../../assets/css/Facebook.css';

const Clock = () => {

    const clockRef = React.useRef();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDate (new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    });

    
    const [date, setDate] = useState(new Date());
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0'); 

    return (
        <div className = "clockContainer" ref={clockRef}> {`${hours}:${minutes}:${seconds}`} </div>
    )
}

export default Clock;
