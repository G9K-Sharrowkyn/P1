import React, { useState, useRef } from 'react';

function ClickCounter() {
  const [clickCount, setClickCount] = useState(0);

  const buttonRef = useRef(null);

  const handleClick = () => {
    setClickCount(prevCount => prevCount + 1);

    buttonRef.current.focus();
  };

  return (
    <div>
      <button ref={buttonRef} onClick={handleClick}>
        Kliknij mnie!
      </button>
      <p>Liczba kliknięć: {clickCount}</p>
    </div>
  );
}

export default ClickCounter;
