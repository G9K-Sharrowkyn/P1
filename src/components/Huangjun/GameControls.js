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
        <label className="text-white font-bold">Tryb gry:</label>
        <select
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