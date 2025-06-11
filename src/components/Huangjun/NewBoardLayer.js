// NewBoardLayer.js
import React from 'react';
import Square from './Square';
import frameImg from '../../assets/new chess files/frame1.png';
import boardImg from '../../assets/new chess files/board1.png';
import NewBoardCaptures from './NewBoardCaptures';
import NewBoardSelectedSquare from './NewBoardSelectedSquare';
import NewBoardMoves from './NewBoardMoves';

const NewBoardLayer = ({
  renderBoard,
  handleClick,
  selected,
  highlighted,
  captureTargets,
  archerTargets,
  useNewPieces,
  boardSizePx,
  useNewBoard,
  square,
  gap,
  offsetX,
  offsetY,
  frameSize
}) => (
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
    <NewBoardSelectedSquare selected={selected} offsetX={offsetX} offsetY={offsetY} square={square} gap={gap} />
    {/* Highlight possible moves (green) */}
    <NewBoardMoves highlighted={highlighted} offsetX={offsetX} offsetY={offsetY} square={square} gap={gap} />
    {/* Highlight possible captures (red) */}
    <NewBoardCaptures captureTargets={captureTargets} offsetX={offsetX} offsetY={offsetY} square={square} gap={gap} />
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
              zIndex: 5,
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

export default NewBoardLayer;
