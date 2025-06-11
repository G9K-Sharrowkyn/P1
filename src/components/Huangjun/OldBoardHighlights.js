// OldBoardHighlights.js
import React from 'react';

const OldBoardHighlights = ({ selected, highlighted, captureTargets, oldSquare, oldGap }) => (
  <>
    {/* Selected square overlay for old board */}
    {selected && (
      <div
        style={{
          position: 'absolute',
          left: selected.x * (oldSquare + oldGap),
          top: selected.y * (oldSquare + oldGap),
          width: oldSquare,
          height: oldSquare,
          background: 'rgba(255,215,0,0.35)',
          borderRadius: 8,
          zIndex: 4,
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
          background: 'rgba(34,197,94,0.35)',
          borderRadius: 8,
          zIndex: 4,
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
          background: 'rgba(220,38,38,0.40)',
          borderRadius: 8,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
    ))}
  </>
);

export default OldBoardHighlights;
