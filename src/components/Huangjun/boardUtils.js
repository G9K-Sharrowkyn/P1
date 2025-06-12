// boardUtils.js
import { TYPE_LETTER, RANK_NAMES } from './constants';

export const makeNotation = (type, from, to, hit = false) => {
  const letter = TYPE_LETTER[type];
  const f = `${from.x + 1}${RANK_NAMES[from.y]}`;
  const t = `${to.x + 1}${RANK_NAMES[to.y]}`;
  return hit ? `${letter}${f}×${t}` : `${letter}${f}-${t}`;
};

export const clearSelection = (setSelected, setHighlighted, setCaptureTargets) => {
  setSelected(null);
  setHighlighted([]);
  setCaptureTargets([]);
};

export const getFlippedCoordinates = (x, y) => ({
  x: 8 - x,
  y: 8 - y,
});

export const getBoardLabels = (flipped) => ({
  rowLabels: flipped
    ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    : ["9", "8", "7", "6", "5", "4", "3", "2", "1"],
  colLabels: flipped ? [...RANK_NAMES].reverse() : RANK_NAMES,
});
