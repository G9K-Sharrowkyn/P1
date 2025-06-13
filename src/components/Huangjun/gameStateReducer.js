// gameStateReducer.js
import { isValidMove, isWithinBounds, isPathClear } from './movementRules';
import { findArcherTargets, isArcherAlreadyTargeting, isTargetCurrentlyVisible } from './archerLogic';
import { DIRS_8 } from './constants';
import { makeNotation } from './boardUtils';

const computeMoveHighlights = (piece, x, y, board, currentTurn) => {
  const moves = [];
  const captures = [];
  
  switch (piece.type) {
    case 'infantry': {
      // Infantry: moves and captures one square diagonally forward or forward
      const dir = piece.team === 'white' ? 1 : -1;
      const possibleMoves = [
        { x: x, y: y + dir },      // Forward
        { x: x - 1, y: y + dir },  // Forward-left
        { x: x + 1, y: y + dir }   // Forward-right
      ];
      
      for (const move of possibleMoves) {
        if (!isWithinBounds(move.x, move.y)) continue;
        const target = board[move.y][move.x];
        if (!target) moves.push(move);
        else if (target.team !== currentTurn) captures.push(move);
      }
      break;
    }
    
    case 'archer': {
      // Archer: moves max 2 squares in any direction
      for (const dir of DIRS_8) {
        for (let dist = 1; dist <= 2; dist++) {
          const tx = x + dir.dx * dist;
          const ty = y + dir.dy * dist;
          if (!isWithinBounds(tx, ty)) break;
          if (!isPathClear(board, { x, y }, { x: tx, y: ty })) break;
          const target = board[ty][tx];
          if (!target) moves.push({ x: tx, y: ty });
          else break;
        }
      }
      // Archer attacks are handled separately through archerTargets state
      // They can attack any unit after waiting one turn
      break;
    }
    
    case 'general': {
      // General: moves like a queen, any distance (within board)
      for (const dir of DIRS_8) {
        for (let dist = 1; dist <= 8; dist++) {
          const tx = x + dir.dx * dist;
          const ty = y + dir.dy * dist;
          if (!isWithinBounds(tx, ty)) break;
          if (!isPathClear(board, { x, y }, { x: tx, y: ty })) break;
          const target = board[ty][tx];
          if (!target) moves.push({ x: tx, y: ty });
          else {
            if (target.team !== currentTurn) captures.push({ x: tx, y: ty });
            break;
          }
        }
      }
      break;
    }
    
    case 'emperor': {
      // Emperor: moves max 3 squares in any direction
      for (const dir of DIRS_8) {
        for (let dist = 1; dist <= 3; dist++) {
          const tx = x + dir.dx * dist;
          const ty = y + dir.dy * dist;
          if (!isWithinBounds(tx, ty)) break;
          if (!isPathClear(board, { x, y }, { x: tx, y: ty })) break;
          const target = board[ty][tx];
          if (!target) {
            moves.push({ x: tx, y: ty });
          } else {
            if (target.team !== currentTurn) {
              captures.push({ x: tx, y: ty });
            } else if (target.type === 'guard') {
              // Allow swapping positions with friendly guards
              captures.push({ x: tx, y: ty, special: 'swap' });
            }
            break;
          }
        }
      }
      
      // Add castling moves if conditions are met
      if (!piece.hasMoved) {
        // Check for guards that could castle
        for (let dx of [-2, 2]) {
          const guardX = x + dx;
          if (!isWithinBounds(guardX, y)) continue;
          const possibleGuard = board[y][guardX];
          if (possibleGuard?.type === 'guard' && possibleGuard.team === currentTurn && !possibleGuard.hasMoved) {
            if (isPathClear(board, { x, y }, { x: guardX, y })) {
              moves.push({ x: x + Math.sign(dx), y: y, special: 'castle' });
            }
          }
        }
      }
      break;
    }
    
    case 'guard': {
      // Guard: moves max 2 squares in any direction
      for (const dir of DIRS_8) {
        for (let dist = 1; dist <= 2; dist++) {
          const tx = x + dir.dx * dist;
          const ty = y + dir.dy * dist;
          if (!isWithinBounds(tx, ty)) break;
          if (!isPathClear(board, { x, y }, { x: tx, y: ty })) break;
          const target = board[ty][tx];
          if (!target) moves.push({ x: tx, y: ty });
          else {
            if (target.team !== currentTurn) captures.push({ x: tx, y: ty });
            break;
          }
        }
      }
      break;
    }
    
    case 'cavalry': {
      // Cavalry: moves max 5 squares in any direction
      // Special ability: can attack two units in a line, taking the place of the second unit
      for (const dir of DIRS_8) {
        for (let dist = 1; dist <= 5; dist++) {
          const tx = x + dir.dx * dist;
          const ty = y + dir.dy * dist;
          if (!isWithinBounds(tx, ty)) break;
          if (!isPathClear(board, { x, y }, { x: tx, y: ty })) break;
          
          const target = board[ty][tx];
          if (!target) {
            moves.push({ x: tx, y: ty });
          } else if (target.team !== currentTurn) {
            // Check for second enemy piece behind this one
            const tx2 = tx + dir.dx;
            const ty2 = ty + dir.dy;
            if (isWithinBounds(tx2, ty2)) {
              const target2 = board[ty2][tx2];
              if (target2 && target2.team !== currentTurn) {
                // Can charge through first enemy to capture both and land on second enemy's position
                captures.push({ x: tx2, y: ty2, special: 'charge', through: { x: tx, y: ty } });
              } else {
                // Normal capture if no second target
                captures.push({ x: tx, y: ty });
              }
            } else {
              // Normal capture if second position is out of bounds
              captures.push({ x: tx, y: ty });
            }
            break;
          } else {
            break;
          }
        }
      }
      break;
    }
  }

  return { moves, captures };
};

const updateArcherTargets = (from, to, moving, target, newBoard, currentTurn, archerTargetsNext, moveHistory) => {
  // After archer moves, add targets
  if (moving.type === 'archer') {
    const archer = { x: to.x, y: to.y };
    // Only add targets that are currently visible
    const targets = findArcherTargets(archer, newBoard, currentTurn)
      .filter(t => isTargetCurrentlyVisible(archer, t, newBoard));
      
    // Add targets with 1 turn wait
    for (const targetPos of targets) {
      if (!isArcherAlreadyTargeting(archerTargetsNext, archer, targetPos, currentTurn)) {
        archerTargetsNext.push({
          from: { ...archer },
          to: { ...targetPos },
          team: currentTurn,
          readyIn: 1
        });
      }
    }
  }

  // Check if enemy pieces enter archer range
  if (target && target.team !== currentTurn && target.type !== 'guard' && target.type !== 'emperor') {
    for (let yAr = 0; yAr < 9; yAr++) {
      for (let xAr = 0; xAr < 9; xAr++) {
        const maybeArcher = newBoard[yAr][xAr];
        if (
          maybeArcher &&
          maybeArcher.type === 'archer' &&
          maybeArcher.team !== currentTurn &&
          maybeArcher.lastMoved !== moveHistory.length
        ) {
          const archerPos = { x: xAr, y: yAr };
          if (isTargetCurrentlyVisible(archerPos, to, newBoard)) {
            if (!isArcherAlreadyTargeting(archerTargetsNext, archerPos, to, maybeArcher.team)) {
              archerTargetsNext.push({
                from: { ...archerPos },
                to: { ...to },
                team: maybeArcher.team,
                readyIn: 1
              });
            }
          }
        }
      }
    }
  }

  return archerTargetsNext;
};

export const handleMove = (state, from, to, special = null) => {
  const { board, currentTurn, archerTargets, moveHistory } = state;
  const moving = board[from.y][from.x];
  const target = board[to.y][to.x];
  let newBoard = JSON.parse(JSON.stringify(board));
  let archerTargetsNext = [...archerTargets];

  // Update last moved and clear archer targets
  if (moving) {
    moving.lastMoved = moveHistory.length;
    if (!moving.hasMoved) moving.hasMoved = true;
    archerTargetsNext = archerTargetsNext.filter(t =>
      !(t.from.x === from.x && t.from.y === from.y && t.team === currentTurn)
    );
  }

  // Handle special moves
  if (special) {
    switch (special.type) {
      case 'castle': {
        // Move emperor
        newBoard[to.y][to.x] = newBoard[from.y][from.x];
        newBoard[from.y][from.x] = null;
        // Move guard
        const guardX = to.x + (to.x > from.x ? 1 : -1);
        const oldGuardX = to.x + (to.x > from.x ? 2 : -2);
        newBoard[to.y][guardX] = newBoard[to.y][oldGuardX];
        newBoard[to.y][oldGuardX] = null;
        break;
      }
      case 'charge': {
        // Handle cavalry charge attack on two targets
        newBoard[to.y][to.x] = null; // Remove first target
        if (special.next) {
          newBoard[special.next.y][special.next.x] = null; // Remove second target
        }
        newBoard[to.y][to.x] = newBoard[from.y][from.x]; // Move cavalry to final position
        newBoard[from.y][from.x] = null;
        break;
      }
      default:
        // Normal move
        newBoard[to.y][to.x] = newBoard[from.y][from.x];
        newBoard[from.y][from.x] = null;
    }
  } else {
    // Normal move
    newBoard[to.y][to.x] = newBoard[from.y][from.x];
    newBoard[from.y][from.x] = null;
  }

  // Infantry promotion
  if (moving.type === 'infantry' && (to.y === 0 || to.y === 8)) {
    newBoard[to.y][to.x].type = 'general';
  }

  // Update archer targets
  archerTargetsNext = updateArcherTargets(from, to, moving, target, newBoard, currentTurn, archerTargetsNext, moveHistory);

  return {
    newBoard,
    archerTargetsNext
  };
};

export const handleArcherAttack = (state, from, to) => {
  const { board, currentTurn, archerTargets } = state;
  let newBoard = JSON.parse(JSON.stringify(board));
  newBoard[to.y][to.x] = null;

  let archerTargetsNext = archerTargets.filter(t =>
    !(t.from.x === from.x && t.from.y === from.y &&
      t.to.x === to.x && t.to.y === to.y &&
      t.readyIn === 0 && t.team === currentTurn)
  );

  return {
    newBoard,
    archerTargetsNext,
    notation: makeNotation('archer', from, to, true) + ' (strzał)'
  };
};

export { computeMoveHighlights };
