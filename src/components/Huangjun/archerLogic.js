// archerLogic.js
import { DIRS_8, MAX_ARCHER_RANGE } from './constants';
import { isWithinBounds, isPathClear } from './movementRules';

// Check if target position is in archer's range and line of sight
export function archerCanSee(from, to, board) {
  console.log('Checking archer vision from', from, 'to', to);
  
  // Basic validation
  if (!from || !to || !board) {
    console.log('Invalid input to archerCanSee');
    return false;
  }
  
  const dx = to.x - from.x, dy = to.y - from.y;
  if (dx === 0 && dy === 0) {
    console.log('Cannot target self');
    return false;
  }
  
  for (const dir of DIRS_8) {
    for (let dist = 1; dist <= MAX_ARCHER_RANGE; dist++) {
      const tx = from.x + dir.dx * dist;
      const ty = from.y + dir.dy * dist;
      if (tx === to.x && ty === to.y) {
        const pathClear = isPathClear(board, from, to);
        console.log('Target found in direction', dir, 'at distance', dist, 'path clear?', pathClear);
        return pathClear;
      }
    }
  }
  console.log('Target not in any valid direction');
  return false;
}

// Find all valid targets for archer (enemy pieces in range and line of sight)
export function findArcherTargets(from, board, team) {
  console.log('Finding archer targets for', from, 'team', team);
  
  // Input validation
  if (!from || !board || !team) {
    console.log('Invalid input to findArcherTargets');
    return [];
  }
  
  let found = [];
  
  // Check all squares within range
  for (const dir of DIRS_8) {
    for (let dist = 1; dist <= MAX_ARCHER_RANGE; dist++) {
      const tx = from.x + dir.dx * dist;
      const ty = from.y + dir.dy * dist;
      
      // Skip if out of bounds
      if (!isWithinBounds(tx, ty)) continue;
      
      const target = board[ty][tx];
      // Check if it's an enemy piece
      if (target && target.team !== team) {
        // Verify it's visible
        if (archerCanSee(from, { x: tx, y: ty }, board)) {
          console.log('Found valid target at', tx, ty);
          found.push({ x: tx, y: ty });
        }
      }
    }
  }
  
  console.log('Total targets found:', found.length);
  return found;
}

// Check if archer is already targeting this position
export function isArcherAlreadyTargeting(archerTargets, from, to, team) {
  if (!archerTargets || !from || !to || !team) {
    console.log('Invalid input to isArcherAlreadyTargeting');
    return false;
  }
  
  return archerTargets.some(
    a =>
      a.from.x === from.x && a.from.y === from.y &&
      a.to.x === to.x && a.to.y === to.y &&
      a.team === team
  );
}

// Check if target is currently visible (not blocked by any pieces)
export function isTargetCurrentlyVisible(archer, target, board) {
  console.log('Checking visibility from', archer, 'to', target);
  
  // Input validation
  if (!archer || !target || !board) {
    console.log('Invalid input to isTargetCurrentlyVisible');
    return false;
  }
  
  // First check if target is in bounds
  if (!isWithinBounds(target.x, target.y) || !isWithinBounds(archer.x, archer.y)) {
    console.log('Position out of bounds');
    return false;
  }

  // Calculate direction to target
  const dx = target.x - archer.x;
  const dy = target.y - archer.y;
  const dist = Math.max(Math.abs(dx), Math.abs(dy));
  
  // Check if within range
  if (dist > MAX_ARCHER_RANGE || dist === 0) {
    console.log('Target out of range or same position');
    return false;
  }

  // Check if target is in one of the 8 directions
  let isValidDirection = false;
  for (const dir of DIRS_8) {
    // Check if this direction could lead to the target
    const maxDist = Math.floor(dist);
    for (let d = 1; d <= maxDist; d++) {
      const tx = archer.x + dir.dx * d;
      const ty = archer.y + dir.dy * d;
      
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
    console.log('Target not in a valid direction');
    return false;
  }

  // Finally check if path is clear
  const pathClear = isPathClear(board, archer, target);
  console.log('Path clear?', pathClear);
  return pathClear;
}