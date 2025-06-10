// BoardRenderer.js
import React from 'react';
import Square from './Square';
import { useGameState } from './GameStateContext';
import boardImg from '../../assets/new chess files/board1.png';
import frameImg from '../../assets/new chess files/frame1.png';

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
      <div
        className="relative"
        style={{ width: frameSize, height: frameSize }}
      >
        <img
          src={frameImg}
          alt="frame"
          style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, zIndex: 0, pointerEvents: 'none' }}
        />
        <img
          src={boardImg}
          alt="board"
          style={{ width: boardSizePx, height: boardSizePx, position: 'absolute', left: offsetX, top: offsetY, zIndex: 1, pointerEvents: 'none' }}
        />
        {/* Selected square overlay */}
        {selected && (
          <div
            style={{
              position: 'absolute',
              left: offsetX + selected.x * (square + gap),
              top: offsetY + selected.y * (square + gap),
              width: square,
              height: square,
              background: 'rgba(255,215,0,0.35)', // Gold
              borderRadius: 8,
              zIndex: 4, // highlight layer
              pointerEvents: 'none',
            }}
          />
        )}
        {/* Highlight possible moves (green) */}
        {highlighted.map(h => (
          <div
            key={`highlight-${h.x}-${h.y}`}
            style={{
              position: 'absolute',
              left: offsetX + h.x * (square + gap),
              top: offsetY + h.y * (square + gap),
              width: square,
              height: square,
              background: 'rgba(34,197,94,0.35)', // Green
              borderRadius: 8,
              zIndex: 4, // highlight layer
              pointerEvents: 'none',
            }}
          />
        ))}
        {/* Highlight possible captures (red) */}
        {captureTargets.map(h => (
          <div
            key={`capture-${h.x}-${h.y}`}
            style={{
              position: 'absolute',
              left: offsetX + h.x * (square + gap),
              top: offsetY + h.y * (square + gap),
              width: square,
              height: square,
              background: 'rgba(220,38,38,0.40)', // Red
              borderRadius: 8,
              zIndex: 4, // highlight layer
              pointerEvents: 'none',
            }}
          />
        ))}
        {/* Render invisible grid squares for piece placement */}
        {renderBoard.map((row, y) =>
          row.map((piece, x) => {
            const left = offsetX + x * (square + gap);
            const top = offsetY + y * (square + gap);
            return (
              <Square
                key={`${x}-${y}`}
                piece={piece}
                onClick={() => handleClick(x, y)}
                isSelected={selected?.x === x && selected?.y === y}
                isHighlighted={highlighted.some(h => h.x === x && h.y === y)}
                isCaptureTarget={captureTargets.some(h => h.x === x && h.y === y)}
                isArcherTarget={archerTargets.some(a => a.to.x === x && a.to.y === y && a.readyIn === 0)}
                useNewPieces={useNewPieces}
                boardSize={boardSizePx}
                useNewBoard={useNewBoard}
                squareSize={square}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width: square,
                  height: square,
                  zIndex: 5, // pieces above highlights
                  background: 'none',
                  boxShadow: 'none',
                  border: 'none',
                }}
              />
            );
          })
        )}
      </div>
    );
  }

  // Old board: use grid layout, match the grid area of board1.png
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

const gridSquares = [];
for (let y = 0; y < 9; y++) {
  for (let x = 0; x < 9; x++) {
    const isLight = (x + y) % 2 === 1;
    gridSquares.push(
      <div
        key={`grid-${x}-${y}`}
        style={{
          position: 'absolute',
          left: x * (oldSquare + oldGap),
          top: y * (oldSquare + oldGap),
          width: oldSquare,
          height: oldSquare,
          background: isLight ? '#b6d68f' : '#ede3ce', // softened tones
          borderRadius: 8,
          boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.15)',
          transition: 'background 0.2s ease-in-out',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />
    );
  }
}



  return (
    <div className="board-grid" style={gridStyle}>
      {/* Render the grid squares visually */}
      {gridSquares}
      {/* Render all highlights above the board image but below the pieces */}
      {/* Selected square overlay for old board */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            left: selected.x * (oldSquare + oldGap),
            top: selected.y * (oldSquare + oldGap),
            width: oldSquare,
            height: oldSquare,
            background: 'rgba(255,215,0,0.35)', // Gold
            borderRadius: 8,
            zIndex: 4, // highlight layer
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Highlight possible moves (green) for old board */}
      {highlighted.map(h => (
        <div
          key={`highlight-old-${h.x}-${h.y}`}
          style={{
            position: 'absolute',
            left: h.x * (oldSquare + oldGap),
            top: h.y * (oldSquare + oldGap),
            width: oldSquare,
            height: oldSquare,
            background: 'rgba(34,197,94,0.35)', // Green
            borderRadius: 8,
            zIndex: 4, // highlight layer
            pointerEvents: 'none',
          }}
        />
      ))}
      {/* Highlight possible captures (red) for old board */}
      {captureTargets.map(h => (
        <div
          key={`capture-old-${h.x}-${h.y}`}
          style={{
            position: 'absolute',
            left: h.x * (oldSquare + oldGap),
            top: h.y * (oldSquare + oldGap),
            width: oldSquare,
            height: oldSquare,
            background: 'rgba(220,38,38,0.40)', // Red
            borderRadius: 8,
            zIndex: 4, // highlight layer
            pointerEvents: 'none',
          }}
        />
      ))}
      {/* Render the pieces and interactive squares */}
      {renderBoard.map((row, y) =>
        row.map((piece, x) => {
          const isSelected = selected?.x === x && selected?.y === y;
          const isHighlighted = highlighted.some(h => h.x === x && h.y === y);
          const isCaptureTarget = captureTargets.some(h => h.x === x && h.y === y);
          let highlightColor = null;
          if (isSelected) {
            highlightColor = 'rgba(255,215,0,0.35)'; // Gold
          } else if (isCaptureTarget) {
            highlightColor = 'rgba(220,38,38,0.40)'; // Red
          } else if (isHighlighted) {
            highlightColor = 'rgba(34,197,94,0.35)'; // Green
          }
          return (
            <Square
              key={`${x}-${y}`}
              piece={piece}
              onClick={() => handleClick(x, y)}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              isCaptureTarget={isCaptureTarget}
              isArcherTarget={archerTargets.some(a => a.to.x === x && a.to.y === y && a.readyIn === 0)}
              useNewPieces={useNewPieces}
              boardSize={boardSizePx}
              useNewBoard={useNewBoard}
              squareSize={oldSquare}
              style={{
                position: 'absolute',
                left: x * (oldSquare + oldGap),
                top: y * (oldSquare + oldGap),
                width: oldSquare,
                height: oldSquare,
                zIndex: 5, // pieces above highlights
                background: highlightColor,
                borderRadius: highlightColor ? 8 : undefined,
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default BoardRenderer;