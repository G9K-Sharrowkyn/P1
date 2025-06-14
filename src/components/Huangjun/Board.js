// Board.js
import React, { useState, useEffect, useRef } from 'react';
import GameStateProvider from './GameStateProvider';
import BoardRenderer from './BoardRenderer';
import BoardResizeHandles from './BoardResizeHandles';
import BoardPanel from './BoardPanel';
import FloatingMenuButton from './FloatingMenuButton';
import { minSize, maxSize } from './boardResize';

const PANEL_WIDTH = 370; // px, panel + margin
const PANEL_MIN_MARGIN = 24; // px, margin from right

const Board = ({ onBackToMenu, aiVsAi = false, showPanel = true }) => {
  const [useNewBoard, setUseNewBoard] = useState(true);
  const [useNewPieces, setUseNewPieces] = useState(true);
  const [boardSize, setBoardSize] = useState(1000);
  const [panelVisible, setPanelVisible] = useState(showPanel);
  const boardContainerRef = useRef(null);

  // Responsive: hide panel if board + panel > window width
  useEffect(() => {
    if (!showPanel) return;
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
  }, [boardSize, showPanel]);

  // When menu button is clicked, show panel and shrink board if needed
  function handleShowPanel() {
    if (!showPanel) return;
    const windowWidth = window.innerWidth;
    const maxBoard = windowWidth - PANEL_WIDTH - PANEL_MIN_MARGIN;
    if (boardSize > maxBoard) setBoardSize(maxBoard);
    setPanelVisible(true);
  }

  return (
    <GameStateProvider aiVsAi={aiVsAi}>
      <div className="flex w-full h-screen items-start justify-start bg-transparent relative" ref={boardContainerRef}>
        {/* Board on the left */}
        <div className="relative flex-shrink-0" style={{ width: boardSize, height: boardSize }}>
          <BoardRenderer
            useNewBoard={useNewBoard}
            useNewPieces={useNewPieces}
            boardSize={boardSize}
          />
          {/* Resize handles in all corners */}
          <BoardResizeHandles boardSize={boardSize} setBoardSize={setBoardSize} />
        </div>
        {/* Right panel for controls and move history */}
        {showPanel && panelVisible && (
          <BoardPanel
            onBackToMenu={onBackToMenu}
            useNewBoard={useNewBoard}
            setUseNewBoard={setUseNewBoard}
            useNewPieces={useNewPieces}
            setUseNewPieces={setUseNewPieces}
          />
        )}
        {/* Floating menu button if panel is hidden */}
        {showPanel && !panelVisible && (
          <FloatingMenuButton onClick={handleShowPanel} />
        )}
      </div>
    </GameStateProvider>
  );
};

export default Board;
