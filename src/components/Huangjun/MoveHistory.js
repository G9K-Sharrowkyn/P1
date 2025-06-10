// MoveHistory.js
import React from 'react';
import { useGameState } from './GameStateContext';

const MoveHistory = () => {
  const { moveHistory, moveIndex, handleUndo, handleRedo } = useGameState();

  return (
    <div className="text-white text-sm w-60">
      <div className="mb-2 font-bold">Historia ruchów:</div>
      <div className="mb-2 max-h-[360px] overflow-y-auto border border-gray-500 p-2">
        {moveHistory.map((m, i) => (
          <div key={i} className={i === moveIndex ? 'text-yellow-400' : ''}>
            {`${i + 1}. ${m.notation}`}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={handleUndo} className="px-2 py-1 bg-gray-700 text-white rounded">←</button>
        <button onClick={handleRedo} className="px-2 py-1 bg-gray-700 text-white rounded">→</button>
      </div>
    </div>
  );
};

export default MoveHistory;