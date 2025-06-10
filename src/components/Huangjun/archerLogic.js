// archerLogic.js
import { DIRS_8, MAX_ARCHER_RANGE } from './constants';
import { isWithinBounds, isPathClear } from './movementRules';

// Czy pole (tx,ty) jest w zasięgu łucznika (od (x,y)), bez przeszkód po drodze?
export function archerCanSee(from, to, board) {
  const dx = to.x - from.x, dy = to.y - from.y;
  if (dx === 0 && dy === 0) return false;
  for (const dir of DIRS_8) {
    for (let dist = 1; dist <= MAX_ARCHER_RANGE; dist++) {
      const tx = from.x + dir.dx * dist, ty = from.y + dir.dy * dist;
      if (tx === to.x && ty === to.y) {
        return isPathClear(board, from, to);
      }
    }
  }
  return false;
}

// Zwraca wszystkie cele dla łucznika po ruchu (tylko te, które są przeciwnikiem)
export function findArcherTargets(from, board, team) {
  let found = [];
  for (const dir of DIRS_8) {
    for (let dist = 1; dist <= MAX_ARCHER_RANGE; dist++) {
      const tx = from.x + dir.dx * dist, ty = from.y + dir.dy * dist;
      if (!isWithinBounds(tx, ty)) break;
      if (!isPathClear(board, from, { x: tx, y: ty })) break;
      const target = board[ty][tx];
      if (target && target.team !== team) {
        found.push({ x: tx, y: ty });
      }
      if (target) break;
    }
  }
  return found;
}

// Czy łucznik już celuje w dany cel (uniknij duplikatów pending strzałów)?
export function isArcherAlreadyTargeting(archerTargets, from, to, team) {
  return archerTargets.some(
    a =>
      a.from.x === from.x && a.from.y === from.y &&
      a.to.x === to.x && a.to.y === to.y &&
      a.team === team
  );
}