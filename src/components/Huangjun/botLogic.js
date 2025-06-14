// botLogic.js
import { isValidMove, isWithinBounds } from './movementRules';
import { archerCanSee } from './archerLogic';
import { getFlippedCoordinates } from './boardUtils';

const findArcherAttacks = (board, archerTargets, team) => {
  const archerAttacks = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const p = board[y][x];
      if (p?.team === team && p?.type === 'archer') {
        const archerReadyTargets = archerTargets.filter(t =>
          t.from.x === x && t.from.y === y &&
          t.team === team &&
          t.readyIn === 0
        );

        if (archerReadyTargets.length > 0) {
          for (const target of archerReadyTargets) {
            const targetPiece = board[target.to.y][target.to.x];
            if (targetPiece && targetPiece.team !== team) {
              archerAttacks.push({
                from: { x, y },
                to: { x: target.to.x, y: target.to.y }
              });
            }
          }
        }
      }
    }
  }
  return archerAttacks;
};

const findValidMoves = (board, team) => {
  const moves = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const p = board[y][x];
      if (p?.team === team) {
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const to = { x: x + dx, y: y + dy };
            if (isWithinBounds(to.x, to.y) && isValidMove(board, { x, y }, to, team)) {
              // Don't allow archer direct captures
              if (p.type === 'archer') {
                const targetPiece = board[to.y][to.x];
                if (targetPiece && targetPiece.team !== team) {
                  continue;
                }
              }
              moves.push({ from: { x, y }, to });
            }
          }
        }
      }
    }
  }
  return moves;
};

export const runBotMove = ({
  board,
  archerTargets,
  handleClick,
  team
}) => {
  // First check for archer attacks
  const archerAttacks = findArcherAttacks(board, archerTargets, team);
  if (archerAttacks.length) {
    const attack = archerAttacks[Math.floor(Math.random() * archerAttacks.length)];
    const from = attack.from;
    const to = attack.to;

    setTimeout(() => {
      handleClick(from.x, from.y);
      setTimeout(() => handleClick(to.x, to.y), 150);
    }, 300);
    return;
  }

  // Otherwise, make a regular move
  const moves = findValidMoves(board, team);
  if (moves.length) {
    const move = moves[Math.floor(Math.random() * moves.length)];
    const from = move.from;
    const to = move.to;

    setTimeout(() => {
      handleClick(from.x, from.y);
      setTimeout(() => handleClick(to.x, to.y), 150);
    }, 300);
  }
};
