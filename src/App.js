import './assets/css/General.css';
import './assets/css/Registration.css';
import './assets/css/CardGame.css';
import React, { useState, useEffect } from "react";
import StarBackground from './components/Background/StarBackground.js';
import HuangjunGame from './components/Huangjun/HuangjunGame';
import AIGamesArchive from './components/Huangjun/AIGamesArchive';
import { connect } from 'react-redux';
import { incrementCounter } from './actions/counter.actions.js'

function App({ incrementCounter }) {
  const [showGame, setShowGame] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    const clickHandler = e => {
      if(e.target.localName === 'a' || e.target.localName === 'button'){
        incrementCounter(1);
      }
    };
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, [incrementCounter]);

  return (
    <div className="relative min-h-screen w-full bg-black">
      <StarBackground/>
      {!showGame && !showArchive ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-8 border border-gray-700">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">Proteus Nebule</h1>
            <h2 className="text-xl text-gray-300 mb-6">Battle Card Game</h2>
            <button
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-lg shadow transition-colors duration-150"
              onClick={() => setShowGame(true)}
            >
              Play Huangjun
            </button>
            <button
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-lg shadow transition-colors duration-150"
              onClick={() => setShowArchive(true)}
            >
              AI Games Archive
            </button>
          </div>
        </div>
      ) : showGame ? (
        <HuangjunGame onBackToMenu={() => setShowGame(false)} />
      ) : (
        <AIGamesArchive onBack={() => setShowArchive(false)} />
      )}
    </div>
  );
}

export default connect(null, {
  incrementCounter
})(App)
