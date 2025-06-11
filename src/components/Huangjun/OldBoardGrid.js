// OldBoardGrid.js
import React from 'react';

const OldBoardGrid = ({ boardSizePx, offsetX, offsetY, oldSquare, oldGap }) => {
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
            background: isLight ? '#b6d68f' : '#ede3ce',
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
  return <>{gridSquares}</>;
};

export default OldBoardGrid;
