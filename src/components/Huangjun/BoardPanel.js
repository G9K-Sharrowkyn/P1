// BoardPanel.js
import React from 'react';
import GameControls from './GameControls';
import MoveHistory from './MoveHistory';
import PieceLegend from './PieceLegend';

const BoardPanel = ({
  onBackToMenu,
  useNewBoard,
  setUseNewBoard,
  useNewPieces,
  setUseNewPieces,
}) => (
  <div className="ml-10 flex flex-col w-[350px] min-h-[700px] bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-6 gap-6 border border-gray-700 transition-all duration-300">
    {/* Back to Menu button */}
    <button
      className="mb-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition-colors duration-150"
      onClick={onBackToMenu}
    >
      ← Back to Menu
    </button>
    {/* Game controls */}
    <div className="flex flex-col gap-4">
      <button
        className={`w-full px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-150 ${useNewBoard ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
        onClick={() => setUseNewBoard(b => !b)}
      >
        {useNewBoard ? 'Use Old Board' : 'Use New Board'}
      </button>
      <button
        className={`w-full px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-150 ${useNewPieces ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'}`}
        onClick={() => setUseNewPieces(p => !p)}
      >
        {useNewPieces ? 'Use Old Pieces' : 'Use New Pieces'}
      </button>
    </div>
    {/* Game controls (turn, mode, etc.) */}
    <GameControls />
    {/* Move history */}
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <MoveHistory />
    </div>
    {/* Piece legend at the bottom */}
    <div className="mt-4">
      <PieceLegend />
    </div>
  </div>
);

export default BoardPanel;
