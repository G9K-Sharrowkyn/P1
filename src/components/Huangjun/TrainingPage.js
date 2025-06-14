import React, { useState } from 'react';
import HuangjunGame from './HuangjunGame';

const TrainingPage = ({ onBackToMenu, onShowArchive }) => {
  const [training, setTraining] = useState(false);
  const [games, setGames] = useState(1);
  const [message, setMessage] = useState('');

  async function startTraining() {
    try {
      const res = await fetch('http://localhost:2002/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ games: parseInt(games, 10) || 1 })
      });
      const data = await res.json();
      setMessage(data.status);
      setTraining(true);
    } catch (err) {
      setMessage('Error starting training');
    }
  }

  return (
    <div className="flex flex-col items-center w-full p-4 text-white">
      <div className="mb-4 space-x-4 flex items-center">
        <button
          className="px-4 py-2 bg-gray-700 rounded"
          onClick={onBackToMenu}
        >
          ← Back
        </button>
        <input
          type="number"
          className="px-2 py-1 w-20 text-black rounded"
          value={games}
          onChange={e => setGames(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 rounded"
          onClick={startTraining}
        >
          Start Training
        </button>
        <button
          className="px-4 py-2 bg-green-600 rounded"
          onClick={onShowArchive}
        >
          Archived Games
        </button>
      </div>
      {message && <div className="mb-2 text-sm text-gray-300">{message}</div>}
      {training && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <HuangjunGame aiVsAi={true} showPanel={false} />
        </div>
      )}
    </div>
  );
};

export default TrainingPage;
