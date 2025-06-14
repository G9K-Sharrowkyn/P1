// NewBoardMoves.js
import React from 'react';

const NewBoardMoves = ({ highlighted, offsetX, offsetY, square, gap }) => (
  <>
    {highlighted.map(h => {
      const bg = h.special === 'swap' ? 'rgba(59,130,246,0.35)' : 'rgba(34,197,94,0.35)';
      return (
        <div
          key={`highlight-${h.x}-${h.y}`}
          style={{
            position: 'absolute',
            left: offsetX + h.x * (square + gap),
            top: offsetY + h.y * (square + gap),
            width: square,
            height: square,
            background: bg,
            borderRadius: 8,
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />
      );
    })}
  </>
);

export default NewBoardMoves;
