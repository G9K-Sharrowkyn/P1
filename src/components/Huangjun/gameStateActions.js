// gameStateActions.js
import { clearSelection, makeNotation } from './boardUtils';
import { handleMove, handleArcherAttack, computeMoveHighlights } from './gameStateReducer';
import { archerCanSee, isTargetCurrentlyVisible } from './archerLogic';

export function clearSelectionState(setSelected, setHighlighted, setCaptureTargets) {
  clearSelection(setSelected, setHighlighted, setCaptureTargets);
}

export function handleClickFactory({
  board, setBoard,
  selected, setSelected,
  currentTurn, setCurrentTurn,
  emperorHits, setEmperorHits,
  winner, setWinner,
  vsBot, setVsBot,
  moveHistory, setMoveHistory,
  moveIndex, setMoveIndex,
  highlighted, setHighlighted,
  captureTargets, setCaptureTargets,
  flipped, setFlipped,
  archerTargets, setArcherTargets
}) {
  return (xRaw, yRaw) => {
    const x = xRaw, y = yRaw;
    const piece = board[y][x];
    // Get only currently visible archer targets
    const globalArcherAttackTargets = archerTargets
      .filter(t => {
        // Must be ready to fire and not moved this turn
        if (!(t.team === currentTurn && 
              t.readyIn === 0 && 
              board[t.from.y][t.from.x]?.lastMoved !== moveHistory.length)) {
          return false;
        }
        // Target must exist and be enemy
        const target = board[t.to.y][t.to.x];
        if (!target || target.team === currentTurn) {
          return false;
        }
        // Must have clear line of sight
        const archer = board[t.from.y][t.from.x];
        return archer && archer.type === 'archer' && 
               isTargetCurrentlyVisible({ x: t.from.x, y: t.from.y }, 
                                     { x: t.to.x, y: t.to.y }, 
                                     board);
      })
      .map(t => ({ x: t.to.x, y: t.to.y }));    if (selected) {
      if (selected.x === x && selected.y === y) {
        // Clear all highlights and selection when deselecting a piece
        clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        // Don't show any capture targets when no piece is selected
        setCaptureTargets([]);
        return;
      }
      const from = selected, to = { x, y };
      const moving = board[from.y][from.x];
      const target = board[to.y][to.x];
      
      // Prevent attacking friendly pieces
      if (target && target.team === currentTurn) {
        return;
      }

      const isArcherAttack = moving.type === 'archer' &&
        globalArcherAttackTargets.some(t => t.x === to.x && t.y === to.y) &&
        archerTargets.some(t =>
          t.from.x === from.x && t.from.y === from.y &&
          t.to.x === to.x && t.to.y === to.y &&
          t.readyIn === 0 && t.team === currentTurn &&
          board[from.y][from.x].lastMoved !== moveHistory.length &&
          isTargetCurrentlyVisible(from, to, board)
        );
      if (isArcherAttack) {
        const { newBoard, archerTargetsNext, notation } = handleArcherAttack({ board, currentTurn, archerTargets }, from, to);
        setBoard(newBoard);
        setArcherTargets(archerTargetsNext);
        setMoveHistory(prev => [...prev, { board: newBoard, turn: currentTurn, notation }]);
        setMoveIndex(i => i + 1);
        setCurrentTurn(t => t === 'white' ? 'black' : 'white');
        clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        return;
      }
      if (target?.type === 'emperor' && target.team !== currentTurn) {
        const nh = { ...emperorHits };
        nh[target.team] += 1;
        setEmperorHits(nh);
        if (nh[target.team] >= 3) setWinner(currentTurn);
      }
      const { newBoard, archerTargetsNext } = handleMove({ board, currentTurn, archerTargets, moveHistory }, from, to);
      setBoard(newBoard);
      setArcherTargets(archerTargetsNext);
      setMoveHistory(prev => [...prev, { board: newBoard, turn: currentTurn, notation: makeNotation(moving.type, from, to, target !== null) }]);
      setMoveIndex(i => i + 1);
      setCurrentTurn(t => t === 'white' ? 'black' : 'white');
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
      return;
    }    if (piece && piece.team === currentTurn) {
      // Clear previous highlights first
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
      
      setSelected({ x, y });
      const { moves, captures } = computeMoveHighlights(piece, x, y, board, currentTurn);
      
      // For archers, only show their own potential shots
      const allCaptures = piece.type === 'archer' 
        ? captures // Only show captures calculated by computeMoveHighlights
        : captures;
        
      setHighlighted(moves);
      setCaptureTargets(allCaptures);
      return;
    }
    
    // If clicking empty square or enemy piece, clear all highlights
    clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
  };
}

export function handleUndoFactory({ moveIndex, setMoveIndex, moveHistory, setBoard, setCurrentTurn, setSelected, setHighlighted, setCaptureTargets }) {
  return () => {
    if (moveIndex > 0) {
      const prev = moveHistory[moveIndex - 1];
      setBoard(prev.board);
      setMoveIndex(mi => mi - 1);
      setCurrentTurn(prev.turn);
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
    }
  };
}

export function handleRedoFactory({ moveIndex, setMoveIndex, moveHistory, setBoard, setCurrentTurn, setSelected, setHighlighted, setCaptureTargets }) {
  return () => {
    if (moveIndex + 1 < moveHistory.length) {
      const next = moveHistory[moveIndex + 1];
      setBoard(next.board);
      setMoveIndex(mi => mi + 1);
      setCurrentTurn(next.turn === 'white' ? 'black' : 'white');
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
    }
  };
}

export function toggleVsBotFactory(setVsBot) {
  return () => setVsBot(prev => !prev);
}

export function toggleFlippedFactory(setFlipped) {
  return () => setFlipped(prev => !prev);
}
