// NewBoardSelectedSquare.js
import React from 'react';

const NewBoardSelectedSquare = ({ selected, offsetX, offsetY, square, gap }) => (
  selected ? (
    <div
      style={{
        position: 'absolute',
        left: offsetX + selected.x * (square + gap),
        top: offsetY + selected.y * (square + gap),
        width: square,
        height: square,
        background: 'rgba(255,215,0,0.35)',
        borderRadius: 8,
        zIndex: 4,
        pointerEvents: 'none',
      }}
    />
  ) : null
);

export default NewBoardSelectedSquare;
