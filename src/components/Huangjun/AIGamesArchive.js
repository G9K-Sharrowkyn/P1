import React, { useEffect, useState } from 'react';

const AIGamesArchive = ({ onBack }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('http://localhost:2002/games')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('fetch games error', err));
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      <div className="bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl p-6 border border-gray-700 w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl text-white mb-4">AI Games Archive</h2>
        <button className="mb-4 px-4 py-2 bg-gray-700 text-white rounded" onClick={onBack}>Back</button>
        {games.map(g => (
          <div key={g.id} className="mb-3 text-sm text-white">
            <div className="font-semibold">Game {g.id}</div>
            <div>Winner: {g.winner}</div>
            <div>Moves: {Array.isArray(g.moves) ? g.moves.join(', ') : ''}</div>
          </div>
        ))}
        {games.length === 0 && <div className="text-gray-400">No games yet</div>}
      </div>
    </div>
  );
};

export default AIGamesArchive;
