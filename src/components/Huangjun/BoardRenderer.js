// BoardRenderer.js
import React from 'react';
import Square from './Square';
import { useGameState } from './GameStateContext';
import boardImg from '../../assets/new chess files/board1.png';
import frameImg from '../../assets/new chess files/frame1.png';
import OldBoardGrid from './OldBoardGrid';
import OldBoardHighlights from './OldBoardHighlights';
import OldBoardPieces from './OldBoardPieces';
import NewBoardLayer from './NewBoardLayer';

const SQUARE_SIZE = 84;
const GAP_SIZE = 5;
const BOARD_IMG_SIZE = 796; // board1.png size
const FRAME_IMG_SIZE = 1200; // frame1.png size
const BOARD_OFFSET_X = 201;
const BOARD_OFFSET_Y = 201;

const BoardRenderer = ({ useNewBoard, useNewPieces, boardSize }) => {
  const { 
    renderBoard, 
    handleClick, 
    selected, 
    highlighted, 
    captureTargets, 
    archerTargets
  } = useGameState();

  // Use boardSize prop if provided, otherwise default to FRAME_IMG_SIZE
  const frameSize = boardSize || FRAME_IMG_SIZE;
  // Scale board and offsets proportionally
  const scale = frameSize / FRAME_IMG_SIZE;
  const boardSizePx = BOARD_IMG_SIZE * scale;
  const offsetX = BOARD_OFFSET_X * scale + 1;
  const offsetY = BOARD_OFFSET_Y * scale + 1;
  const square = SQUARE_SIZE * scale;
  const gap = GAP_SIZE * scale;

  if (useNewBoard) {
    return (
      <NewBoardLayer
        renderBoard={renderBoard}
        handleClick={handleClick}
        selected={selected}
        highlighted={highlighted}
        captureTargets={captureTargets}
        archerTargets={archerTargets}
        useNewPieces={useNewPieces}
        boardSizePx={boardSizePx}
        useNewBoard={useNewBoard}
        square={square}
        gap={gap}
        offsetX={offsetX}
        offsetY={offsetY}
        frameSize={frameSize}
      />
    );
  }

  // Old board: use grid layout, match the grid area of board1.png
const oldSquare = SQUARE_SIZE * scale;
const oldGap = GAP_SIZE * scale;

const gridStyle = {
  width: boardSizePx,
  height: boardSizePx,
  backgroundColor: '#dcd2bc', // warmer neutral tone
  position: 'absolute',
  left: offsetX,
  top: offsetY,
  zIndex: 2,
};

  return (
    <div className="board-grid" style={gridStyle}>
      {/* Render the grid squares visually */}
      <OldBoardGrid boardSizePx={boardSizePx} offsetX={offsetX} offsetY={offsetY} oldSquare={oldSquare} oldGap={oldGap} />
      {/* Render all highlights above the board image but below the pieces */}
      <OldBoardHighlights selected={selected} highlighted={highlighted} captureTargets={captureTargets} oldSquare={oldSquare} oldGap={oldGap} />
      {/* Render the pieces and interactive squares */}
      <OldBoardPieces
        renderBoard={renderBoard}
        handleClick={handleClick}
        selected={selected}
        highlighted={highlighted}
        captureTargets={captureTargets}
        archerTargets={archerTargets}
        useNewPieces={useNewPieces}
        boardSizePx={boardSizePx}
        useNewBoard={useNewBoard}
        oldSquare={oldSquare}
        oldGap={oldGap}
      />
    </div>
  );
};

export default BoardRenderer;