// NewBoardMoves.js
import React from 'react';

const NewBoardMoves = ({ highlighted, offsetX, offsetY, square, gap }) => (
  <>
    {highlighted.map(h => (
      <div
        key={`highlight-${h.x}-${h.y}`}
        style={{
          position: 'absolute',
          left: offsetX + h.x * (square + gap),
          top: offsetY + h.y * (square + gap),
          width: square,
          height: square,
          background: 'rgba(34,197,94,0.35)',
          borderRadius: 8,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
    ))}
  </>
);

export default NewBoardMoves;
