// Highlight.js
// Centralized highlight system for Huangjun board game
// Combines highlight logic and presentational overlays for both old and new boards

import React from 'react';

// --- Highlight overlays for new board ---
export const NewBoardSelectedSquare = ({ selected, offsetX, offsetY, square, gap }) => (
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

export const NewBoardMoves = ({ highlighted, offsetX, offsetY, square, gap }) => (
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

export const NewBoardCaptures = ({ captureTargets, offsetX, offsetY, square, gap }) => (
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

// --- Highlight overlays for old board ---
export const OldBoardHighlights = ({ selected, highlighted, captureTargets, oldSquare, oldGap }) => (
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
    {highlighted.map(h => {
      const bg = h.special === 'swap' ? 'rgba(59,130,246,0.35)' : 'rgba(34,197,94,0.35)';
      return (
        <div
          key={`highlight-old-${h.x}-${h.y}`}
          style={{
            position: 'absolute',
            left: h.x * (oldSquare + oldGap),
            top: h.y * (oldSquare + oldGap),
            width: oldSquare,
            height: oldSquare,
            background: bg,
            borderRadius: 8,
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />
      );
    })}
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

// --- Highlight logic (move/capture computation) ---
// Re-export computeMoveHighlights from gameStateReducer for central access
export { computeMoveHighlights } from './gameStateReducer';

// --- Utility for clearing highlights ---
export { clearSelection } from './boardUtils';

// --- Types ---
// highlighted: Array<{x: number, y: number}>
// captureTargets: Array<{x: number, y: number}>
// selected: {x: number, y: number} | null

// Usage:
// import { NewBoardSelectedSquare, NewBoardMoves, NewBoardCaptures, OldBoardHighlights, computeMoveHighlights, clearSelection } from './Highlight';
