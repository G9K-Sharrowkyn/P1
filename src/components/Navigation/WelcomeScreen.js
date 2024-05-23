import React, { useState } from 'react';
import '../../assets/css/WelcomeScreen.css'; 

const WelcomeScreen = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [password, setPassword] = useState('');
  const correctPassword = 'ImperatorChroni';

  const handleStartClick = () => {
    if (password === correctPassword) {
      setShowWelcome(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className={`welcome-screen ${showWelcome ? 'show' : 'hide'}`}>
      {showWelcome ? (
        <div className="welcome-content">
          <div className="ImperatorChroni"></div>
          <input className='startInput'
            type="password"
            placeholder="Wprowadź hasło"
            value={password}
            onChange={handlePasswordChange}
          />
          <button className="start-button" onClick={handleStartClick}>
            Start
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default WelcomeScreen;