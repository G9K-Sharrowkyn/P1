// Board.js
import React, { useState, useEffect, useRef } from 'react';
import { GameStateProvider } from './GameStateContext';
import BoardRenderer from './BoardRenderer';
import GameControls from './GameControls';
import MoveHistory from './MoveHistory';
import PieceLegend from './PieceLegend';

const PANEL_WIDTH = 370; // px, panel + margin
const PANEL_MIN_MARGIN = 24; // px, margin from right

const Board = ({ onBackToMenu }) => {
  const [useNewBoard, setUseNewBoard] = useState(true);
  const [useNewPieces, setUseNewPieces] = useState(true);
  // Make the board large by default
  const [boardSize, setBoardSize] = useState(1000);
  const [panelVisible, setPanelVisible] = useState(true);
  const boardContainerRef = useRef(null);
  const minSize = 700;
  const maxSize = 1400;

  // Enhanced resize handler to support all corners
  const handleResize = (e, direction = 'se') => {
    e.preventDefault();
    e.stopPropagation();
    let startX = e.clientX;
    let startY = e.clientY;
    let startSize = boardSize;
    const onMouseMove = (moveEvent) => {
      let dx = moveEvent.clientX - startX;
      let dy = moveEvent.clientY - startY;
      let delta = 0;
      if (direction === 'se') delta = Math.max(dx, dy);
      if (direction === 'ne') delta = Math.max(dx, -dy);
      if (direction === 'sw') delta = Math.max(-dx, dy);
      if (direction === 'nw') delta = Math.max(-dx, -dy);
      let newSize = Math.max(minSize, Math.min(maxSize, startSize + delta));
      setBoardSize(newSize);
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Responsive: hide panel if board + panel > window width
  useEffect(() => {
    function checkPanelVisibility() {
      const windowWidth = window.innerWidth;
      if (boardSize + PANEL_WIDTH + PANEL_MIN_MARGIN > windowWidth) {
        setPanelVisible(false);
      } else {
        setPanelVisible(true);
      }
    }
    checkPanelVisibility();
    window.addEventListener('resize', checkPanelVisibility);
    return () => window.removeEventListener('resize', checkPanelVisibility);
  }, [boardSize]);

  // When menu button is clicked, show panel and shrink board if needed
  function handleShowPanel() {
    const windowWidth = window.innerWidth;
    const maxBoard = windowWidth - PANEL_WIDTH - PANEL_MIN_MARGIN;
    if (boardSize > maxBoard) setBoardSize(maxBoard);
    setPanelVisible(true);
  }

  return (
    <GameStateProvider>
      <div className="flex w-full h-screen items-start justify-start bg-transparent relative" ref={boardContainerRef}>
        {/* Board on the left */}
        <div className="relative flex-shrink-0" style={{ width: boardSize, height: boardSize }}>
          <BoardRenderer
            useNewBoard={useNewBoard}
            useNewPieces={useNewPieces}
            boardSize={boardSize}
          />
          {/* Resize handles in all corners */}
          {/* SE */}
          <div
            className="absolute right-0 bottom-0 w-8 h-8 flex items-end justify-end cursor-nwse-resize z-20 select-none"
            onMouseDown={e => handleResize(e, 'se')}
            title="Resize board (bottom right)"
          >
            <svg width="32" height="32" className="text-gray-500" viewBox="0 0 32 32">
              <polyline points="8,32 32,32 32,8" fill="none" stroke="currentColor" strokeWidth="3" />
              <polyline points="20,32 32,20" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>
          {/* NE */}
          <div
            className="absolute right-0 top-0 w-8 h-8 flex items-start justify-end cursor-nesw-resize z-20 select-none"
            onMouseDown={e => handleResize(e, 'ne')}
            title="Resize board (top right)"
          >
            <svg width="32" height="32" className="text-gray-500 rotate-90" viewBox="0 0 32 32">
              <polyline points="8,32 32,32 32,8" fill="none" stroke="currentColor" strokeWidth="3" />
              <polyline points="20,32 32,20" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>
          {/* SW */}
          <div
            className="absolute left-0 bottom-0 w-8 h-8 flex items-end justify-start cursor-nesw-resize z-20 select-none"
            onMouseDown={e => handleResize(e, 'sw')}
            title="Resize board (bottom left)"
          >
            <svg width="32" height="32" className="text-gray-500 -rotate-90" viewBox="0 0 32 32">
              <polyline points="8,32 32,32 32,8" fill="none" stroke="currentColor" strokeWidth="3" />
              <polyline points="20,32 32,20" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>
          {/* NW */}
          <div
            className="absolute left-0 top-0 w-8 h-8 flex items-start justify-start cursor-nwse-resize z-20 select-none"
            onMouseDown={e => handleResize(e, 'nw')}
            title="Resize board (top left)"
          >
            <svg width="32" height="32" className="text-gray-500 rotate-180" viewBox="0 0 32 32">
              <polyline points="8,32 32,32 32,8" fill="none" stroke="currentColor" strokeWidth="3" />
              <polyline points="20,32 32,20" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>
        </div>
        {/* Right panel for controls and move history */}
        {panelVisible && (
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
        )}
        {/* Floating menu button if panel is hidden */}
        {!panelVisible && (
          <button
            className="fixed top-6 right-6 z-50 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-full shadow-xl transition-all duration-200"
            onClick={handleShowPanel}
            title="Show Menu"
          >
            Menu
          </button>
        )}
      </div>
    </GameStateProvider>
  );
};

export default Board;
