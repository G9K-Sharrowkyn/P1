// movementRules.js
// ────────────────
export const isWithinBounds = (x, y) =>
  x >= 0 && x < 9 && y >= 0 && y < 9;

// Sprawdza, czy na ścieżce między from→to nie stoi żadna figura
export function isPathClear(board, from, to) {
  const dx    = to.x - from.x;
  const dy    = to.y - from.y;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  if (steps === 0) return true;
  const stepX = dx / steps;
  const stepY = dy / steps;

  for (let i = 1; i < steps; i++) {
    const x = from.x + stepX * i;
    const y = from.y + stepY * i;
    if (!Number.isInteger(x) || !Number.isInteger(y)) continue;
    if (board[y][x] !== null) return false;
  }
  return true;
}

export function isValidMove(board, from, to, currentTurn) {
  
  if (!isWithinBounds(to.x, to.y)) {
    return false;
  }

  const piece = board[from.y][from.x];
  if (!piece || piece.team !== currentTurn) {
    return false;
  }

  const dest = board[to.y][to.x];
  if (dest?.team === currentTurn) {
    return false;
  }

  const dx    = to.x - from.x;
  const dy    = to.y - from.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  

  switch (piece.type) {
    case "emperor": {
      const valid = (
        (dx === 0 && absDy <= 3) ||
        (dy === 0 && absDx <= 3) ||
        (absDx === absDy && absDx <= 3)
      );
      if (valid) return isPathClear(board, from, to);
      return false;
    }

    case "general": {
      const valid = dx === 0 || dy === 0 || absDx === absDy;
      if (valid) return isPathClear(board, from, to);
      return false;
    }

    case "guard": {
      const dir = piece.team === "white" ? 1 : -1;
      if ([1, 2, 3].some((n) => dy === n * dir)) {
        const n = Math.abs(dy);
        const valid = dx === 0 || absDx === n;
        if (valid) return isPathClear(board, from, to);
      }
      return false;
    }

    case "archer": {
      if (dest) {
        return false;
      }
      const valid = (dx === 0 || dy === 0 || absDx === absDy) && // Must move in straight line
          Math.max(absDx, absDy) <= 3 && // Up to 3 squares
          (absDx !== 0 || absDy !== 0); // Must move at least 1 square
      if (valid) return isPathClear(board, from, to);
      return false;
    }

    case "cavalry": {
      const valid = (dx === 0 || dy === 0 || absDx === absDy) &&
        absDx <= 5 &&
        absDy <= 5;
      if (valid) return isPathClear(board, from, to);
      return false;
    }

    case "infantry": {
      const dir = piece.team === "white" ? 1 : -1;
      const valid = dy === dir && (dx === 0 || absDx === 1);
      return valid;
    }

    default:
      return false;
  }
}
