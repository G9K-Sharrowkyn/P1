import { DIRS_8 } from './constants';
import { isWithinBounds } from './movementRules';

export function isEmperorProtected(board, pos) {
  const emperor = board[pos.y][pos.x];
  if (!emperor || emperor.type !== 'emperor') return false;
  for (const dir of DIRS_8) {
    const nx = pos.x + dir.dx;
    const ny = pos.y + dir.dy;
    if (!isWithinBounds(nx, ny)) continue;
    const neighbor = board[ny][nx];
    if (neighbor?.type === 'guard' && neighbor.team === emperor.team) {
      return true;
    }
  }
  return false;
}