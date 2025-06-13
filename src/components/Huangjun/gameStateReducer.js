// gameStateReducer.js
import { isValidMove, isWithinBounds, isPathClear } from './movementRules';
import { findArcherTargets, isArcherAlreadyTargeting, isTargetCurrentlyVisible } from './archerLogic';
import { DIRS_8 } from './constants';
import { makeNotation } from './boardUtils';

const computeMoveHighlights = (piece, x, y, board, currentTurn) => {
  const moves = [];
  const captures = [];
  
  // Get max range based on piece type
  const maxRange = piece.type === 'cavalry' ? 5 : 3;
  
  // Check moves based on piece type
  switch (piece.type) {
    case 'infantry': {
      // Infantry can only move forward 1 square or capture diagonally forward
      const dir = piece.team === 'white' ? 1 : -1;
      const possibleMoves = [
        { x: x, y: y + dir },      // Forward
        { x: x - 1, y: y + dir },  // Forward-left capture
        { x: x + 1, y: y + dir }   // Forward-right capture
      ];
      
      for (const move of possibleMoves) {
        if (!isWithinBounds(move.x, move.y)) continue;
        const target = board[move.y][move.x];
        if (move.x === x) {
          // Forward move must be to empty square
          if (!target) moves.push(move);
        } else {
          // Diagonal moves only for capture
          if (target && target.team !== currentTurn) captures.push(move);
        }
      }
      break;
    }
    
    case 'archer': {
      // Archer movement (1-3 squares in straight lines, can't land on pieces)
      for (const dir of DIRS_8) {
        for (let dist = 1; dist <= 3; dist++) {
          const tx = x + dir.dx * dist;
          const ty = y + dir.dy * dist;
          if (!isWithinBounds(tx, ty)) break;
          if (!isPathClear(board, { x, y }, { x: tx, y: ty })) break;
          if (board[ty][tx]) break; // Can't move onto pieces
          moves.push({ x: tx, y: ty });
        }
      }
      // Add archer attack targets separately
      const targets = findArcherTargets({ x, y }, board, currentTurn);
      captures.push(...targets);
      break;
    }
    
    case 'guard': {
      // Guard moves 1-3 squares forward or forward-diagonal
      const dir = piece.team === 'white' ? 1 : -1;
      for (let dist = 1; dist <= 3; dist++) {
        const possibleMoves = [
          { x: x, y: y + (dist * dir) },       // Forward
          { x: x - dist, y: y + (dist * dir)}, // Forward-left
          { x: x + dist, y: y + (dist * dir)}  // Forward-right
        ];
        
        for (const move of possibleMoves) {
          if (!isWithinBounds(move.x, move.y)) continue;
          if (!isPathClear(board, { x, y }, move)) continue;
          const target = board[move.y][move.x];
          if (!target) moves.push(move);
          else if (target.team !== currentTurn) captures.push(move);
        }
      }
      break;
    }
    
    default: {
      // For emperor, general, and cavalry - check in all 8 directions up to their max range
      for (const dir of DIRS_8) {
        for (let dist = 1; dist <= maxRange; dist++) {
          const tx = x + dir.dx * dist;
          const ty = y + dir.dy * dist;
          if (!isWithinBounds(tx, ty)) break;
          if (!isPathClear(board, { x, y }, { x: tx, y: ty })) break;
          const target = board[ty][tx];
          if (!target) moves.push({ x: tx, y: ty });
          else {
            if (target.team !== currentTurn) captures.push({ x: tx, y: ty });
            break; // Can't move past pieces
          }
        }
      }
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

export const handleMove = (state, from, to) => {
  const { board, currentTurn, archerTargets, moveHistory } = state;
  const moving = board[from.y][from.x];
  const target = board[to.y][to.x];
  let newBoard = JSON.parse(JSON.stringify(board));
  let archerTargetsNext = [...archerTargets];

  // Update last moved
  if (moving) {
    moving.lastMoved = moveHistory.length;
    // Clear any targeting from the moved piece
    archerTargetsNext = archerTargetsNext.filter(t =>
      !(t.from.x === from.x && t.from.y === from.y && t.team === currentTurn)
    );
  }

  // Special handling for guard
  if (target?.type === 'guard' && target.team !== currentTurn) {
    newBoard[to.y][to.x] = null;
    newBoard[from.y][from.x] = null;
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
