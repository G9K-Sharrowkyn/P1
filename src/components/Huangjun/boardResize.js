// boardResize.js
// Utility for board resizing logic

export const minSize = 700;
export const maxSize = 1400;

export function getResizeDelta(direction, dx, dy) {
  if (direction === 'se') return Math.max(dx, dy);
  if (direction === 'ne') return Math.max(dx, -dy);
  if (direction === 'sw') return Math.max(-dx, dy);
  if (direction === 'nw') return Math.max(-dx, -dy);
  return 0;
}

export function clampBoardSize(size) {
  return Math.max(minSize, Math.min(maxSize, size));
}
