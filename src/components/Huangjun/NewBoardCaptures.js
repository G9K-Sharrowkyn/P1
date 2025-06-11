// NewBoardCaptures.js
import React from 'react';

const NewBoardCaptures = ({ captureTargets, offsetX, offsetY, square, gap }) => (
  <>
    {captureTargets.map(h => (
      <div
        key={`capture-${h.x}-${h.y}`}
        style={{
          position: 'absolute',
          left: offsetX + h.x * (square + gap),
          top: offsetY + h.y * (square + gap),
          width: square,
          height: square,
          background: 'rgba(220,38,38,0.40)',
          borderRadius: 8,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
    ))}
  </>
);

export default NewBoardCaptures;
