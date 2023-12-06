import React, { useEffect, useState } from "react";

function DarkToLight(){
    const currentTheme = localStorage.getItem('theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const [theme, setTheme] = useState(currentTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleClick = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    }

    return (
        <button className="w-44 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl" onClick={handleClick}>
            {theme === 'dark' ? "Light" : "Dark"}
        </button>
    );
}
    
export default DarkToLight;
