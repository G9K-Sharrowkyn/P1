// botLogic.js
import { isValidMove, isWithinBounds } from './movementRules';
import { archerCanSee } from './archerLogic';

const PIECE_VALUES = {
  emperor: 1000,
  general: 9,
  guard: 5,
  archer: 4,
  cavalry: 3,
  infantry: 1
};

const otherTeam = team => (team === 'white' ? 'black' : 'white');

const cloneBoard = board => board.map(r => r.map(p => (p ? { ...p } : null)));

const applyMove = (board, move) => {
  const newBoard = cloneBoard(board);
  const piece = { ...newBoard[move.from.y][move.from.x] };
  newBoard[move.from.y][move.from.x] = null;
  if (piece) {
    if (piece.type === 'infantry' && (move.to.y === 0 || move.to.y === 8)) {
      piece.type = 'general';
    }
    newBoard[move.to.y][move.to.x] = piece;
  }
  return newBoard;
};

const evaluateBoard = (board, team) => {
  let score = 0;
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const p = board[y][x];
      if (!p) continue;
      const value = PIECE_VALUES[p.type] || 0;
      score += p.team === team ? value : -value;
    }
  }
  return score;
};

const minimax = (board, team, depth, maxTeam) => {
  if (depth === 0) return evaluateBoard(board, maxTeam);
  const moves = findValidMoves(board, team);
  if (!moves.length) return evaluateBoard(board, maxTeam);

  if (team === maxTeam) {
    let best = -Infinity;
    for (const move of moves) {
      const val = minimax(applyMove(board, move), otherTeam(team), depth - 1, maxTeam);
      if (val > best) best = val;
    }
    return best;
  }

  let worst = Infinity;
  for (const move of moves) {
    const val = minimax(applyMove(board, move), otherTeam(team), depth - 1, maxTeam);
    if (val < worst) worst = val;
  }
  return worst;
};

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
  const moves = [
    ...findValidMoves(board, team),
    ...findArcherAttacks(board, archerTargets, team)
  ];

  if (!moves.length) return;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const projected = applyMove(board, move);
    const score = minimax(projected, otherTeam(team), 1, team);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  const { from, to } = bestMove;

  setTimeout(() => {
    handleClick(from.x, from.y);
    setTimeout(() => handleClick(to.x, to.y), 150);
  }, 3000);
};
