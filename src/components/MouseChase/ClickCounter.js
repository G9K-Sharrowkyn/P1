import React, { useState, useRef } from 'react';

function ClickCounter() {
  const [clickCount, setClickCount] = useState(0);
  const buttonRef = useRef(null);

  const handleClick = () => {
    setClickCount(prevCount => prevCount + 1);
    buttonRef.current.focus();
  };

  return (
    <div className="flex justify-end">
      <div className="space-y-4">
        <button 
          className="w-50 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl"
          onClick={handleClick} 
          ref={buttonRef}
        >
          Kliknij mnie!
        </button>
        <p className="w-50 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl">
          Liczba kliknięć: {clickCount}
        </p>
      </div>
    </div>
  );
}

export default ClickCounter;