// OldBoardPieces.js
import React from 'react';
import Square from './Square';

const OldBoardPieces = ({
  renderBoard,
  handleClick,
  selected,
  highlighted,
  captureTargets,
  archerTargets,
  useNewPieces,
  boardSizePx,
  useNewBoard,
  oldSquare,
  oldGap
}) => (
  <>
    {renderBoard.map((row, y) =>
      row.map((piece, x) => {
        const isSelected = selected?.x === x && selected?.y === y;
        const highlightObj = highlighted.find(h => h.x === x && h.y === y);
        const isHighlighted = Boolean(highlightObj);
        const isCaptureTarget = captureTargets.some(h => h.x === x && h.y === y);
        let highlightColor = null;
        if (isSelected) {
          highlightColor = 'rgba(255,215,0,0.35)';
        } else if (isCaptureTarget) {
          highlightColor = 'rgba(220,38,38,0.40)';
        } else if (isHighlighted) {
          highlightColor =
            highlightObj.special === 'swap'
              ? 'rgba(59,130,246,0.35)'
              : 'rgba(34,197,94,0.35)';
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
              zIndex: 5,
              background: highlightColor,
              borderRadius: highlightColor ? 8 : undefined,
            }}
          />
        );
      })
    )}
  </>
);

export default OldBoardPieces;
