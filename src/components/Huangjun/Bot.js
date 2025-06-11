// Bot.js
// Contains the bot move logic for GameStateContext

export function runBotMove({
  board,
  archerTargets,
  moveHistory,
  moveIndex,
  currentTurn,
  winner,
  vsBot,
  handleClick
}) {
  if (vsBot && currentTurn === 'black' && !winner && moveIndex === moveHistory.length - 1) {
    // First check if there are any archers with ready targets (priority action)
    const archerAttacks = [];
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const p = board[y][x];
        if (p?.team === 'black' && p?.type === 'archer') {
          const archerReadyTargets = archerTargets.filter(t =>
            t.from.x === x && t.from.y === y &&
            t.team === 'black' &&
            t.readyIn === 0
          );
          if (archerReadyTargets.length > 0) {
            for (const target of archerReadyTargets) {
              const targetPiece = board[target.to.y][target.to.x];
              if (targetPiece && targetPiece.team !== 'black') {
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
    if (archerAttacks.length) {
      const attack = archerAttacks[Math.floor(Math.random() * archerAttacks.length)];
      setTimeout(() => {
        handleClick(8 - attack.from.x, 8 - attack.from.y);
        setTimeout(() => handleClick(8 - attack.to.x, 8 - attack.to.y), 150);
      }, 300);
      return;
    }
    // Otherwise, make a regular move
    const moves = [];
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const p = board[y][x];
        if (p?.team === 'black') {
          for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
              const to = { x: x + dx, y: y + dy };
              // isValidMove must be passed in from context
              if (p.isValidMove && p.isValidMove(board, { x, y }, to, 'black')) {
                if (p.type === 'archer') {
                  const targetPiece = board[to.y]?.[to.x];
                  if (targetPiece && targetPiece.team !== 'black') {
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
    if (moves.length) {
      const m = moves[Math.floor(Math.random() * moves.length)];
      setTimeout(() => {
        handleClick(8 - m.from.x, 8 - m.from.y);
        setTimeout(() => handleClick(8 - m.to.x, 8 - m.to.y), 150);
      }, 300);
    }
  }
}
