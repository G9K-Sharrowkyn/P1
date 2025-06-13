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
  // Check all squares within range
  for (let dy = -MAX_ARCHER_RANGE; dy <= MAX_ARCHER_RANGE; dy++) {
    for (let dx = -MAX_ARCHER_RANGE; dx <= MAX_ARCHER_RANGE; dx++) {
      const tx = from.x + dx;
      const ty = from.y + dy;
      
      // Skip if out of bounds
      if (!isWithinBounds(tx, ty)) continue;
      
      const target = board[ty][tx];
      // Check if it's an enemy piece
      if (target && target.team !== team) {
        // Verify it's in one of the 8 directions and has clear line of sight
        if (isTargetCurrentlyVisible(from, { x: tx, y: ty }, board)) {
          found.push({ x: tx, y: ty });
        }
      }
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

// Check if target is currently visible (not blocked by any pieces)
export function isTargetCurrentlyVisible(archer, target, board) {
  // First check if target is in bounds
  if (!isWithinBounds(target.x, target.y) || !isWithinBounds(archer.x, archer.y)) {
    return false;
  }

  // Calculate direction to target
  const dx = target.x - archer.x;
  const dy = target.y - archer.y;
  const dist = Math.max(Math.abs(dx), Math.abs(dy));
  
  // Check if within range
  if (dist > MAX_ARCHER_RANGE || dist === 0) {
    return false;
  }

  // Check if target is in one of the 8 directions
  let isValidDirection = false;
  for (const dir of DIRS_8) {
    for (let d = 1; d <= dist; d++) {
      const tx = archer.x + dir.dx * d;
      const ty = archer.y + dir.dy * d;
      
      // Make sure we don't check out of bounds positions
      if (!isWithinBounds(tx, ty)) {
        break;
      }
      
      if (tx === target.x && ty === target.y) {
        isValidDirection = true;
        break;
      }
    }
    if (isValidDirection) break;
  }

  if (!isValidDirection) {
    return false;
  }

  // Finally check if path is clear
  return isPathClear(board, archer, target);
}