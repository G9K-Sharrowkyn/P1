import React, { useState } from 'react';
import Board from './Board';

const TrainingPage = ({ onBackToMenu }) => {
  const [running, setRunning] = useState(false);

  const startTraining = () => {
    setRunning(true);
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-8 bg-gradient-to-br from-gray-900 to-black">
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          onClick={startTraining}
        >
          Start Training
        </button>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          onClick={() => {}}
        >
          Archive Games
        </button>
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          onClick={onBackToMenu}
        >
          ← Back to Menu
        </button>
      </div>
      {running ? (
        <div className="flex flex-wrap gap-8 justify-center w-full">
          <Board autoPlay onBackToMenu={() => {}} />
        </div>
      ) : (
        <div className="text-white mt-6">Click "Start Training" to begin watching AI games.</div>
      )}
    </div>
  );
};

export default TrainingPage;
