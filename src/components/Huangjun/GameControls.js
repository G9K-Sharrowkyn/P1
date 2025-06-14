// GameControls.js
import React from 'react';
import { useGameState } from './GameStateContext';

const GameControls = () => {
  const { 
    currentTurn, 
    emperorHits, 
    vsBot, 
    toggleVsBot,
    toggleFlipped,
    winner
  } = useGameState();

  return (
    <>
      <div className="mb-2 text-white font-bold">
        Tura: {currentTurn.toUpperCase()}  | 
        Hits: White {emperorHits.white}, Black {emperorHits.black}
      </div>
      
      <div className="mb-2 flex items-center gap-4">
        <label htmlFor="gameMode" className="text-white font-bold">Tryb gry:</label>
        <select
          id="gameMode"
          name="gameMode"
          className="px-2 py-1 rounded"
          value={vsBot ? 'bot' : 'hotseat'}
          onChange={e => toggleVsBot()}
        >
          <option value="hotseat">Hot-seat</option>
          <option value="bot">Z botem</option>
        </select>
        
        <button
          className="px-2 py-1 bg-gray-700 text-white rounded"
          onClick={toggleFlipped}
        >
          Obróć planszę
        </button>
        <button
          className="ml-2 px-2 py-1 bg-green-700 text-white rounded"
          onClick={() => {
            console.log('sending training request');
            fetch('http://localhost:2002/train', { method: 'POST' })
              .then(res => res.json())
              .then(data => console.log('train response', data))
              .catch(err => console.error('train request error', err));
          }}
        >
          Train AI
        </button>
      </div>
      
      {winner && (
        <div className="text-2xl text-yellow-400 font-bold mb-4">
          {winner.toUpperCase()} WYGRYWA!
        </div>
      )}
    </>
  );
};

export default GameControls;