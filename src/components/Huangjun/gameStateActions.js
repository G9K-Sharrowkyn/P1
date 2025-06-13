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

    // If we already have a piece selected
    if (selected) {
      // Clicking the same piece again - deselect it
      if (selected.x === x && selected.y === y) {
        clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        return;
      }

      const from = selected, to = { x, y };
      const moving = board[from.y][from.x];
      const target = board[to.y][to.x];
      
      // Check if this is a valid move or capture
      const isValidDestination = 
        highlighted.some(h => h.x === x && h.y === y) ||
        captureTargets.some(c => c.x === x && c.y === y);
      
      if (!isValidDestination) {
        clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        return;
      }

      // Handle emperor hits
      if (target?.type === 'emperor' && target.team !== currentTurn) {
        const nh = { ...emperorHits };
        nh[target.team] += 1;
        setEmperorHits(nh);
        if (nh[target.team] >= 3) setWinner(currentTurn);
      }

      // Make the move
      const { newBoard, archerTargetsNext } = handleMove({ board, currentTurn, archerTargets, moveHistory }, from, to);
      setBoard(newBoard);
      setArcherTargets(archerTargetsNext);
      setMoveHistory(prev => [...prev, { 
        board: newBoard, 
        turn: currentTurn, 
        notation: makeNotation(moving.type, from, to, target !== null) 
      }]);
      setMoveIndex(i => i + 1);
      setCurrentTurn(t => t === 'white' ? 'black' : 'white');
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
    } else if (piece && piece.team === currentTurn) {
      // Selecting a new piece
      setSelected({ x, y });
      const { moves, captures } = computeMoveHighlights(piece, x, y, board, currentTurn);
      setHighlighted(moves);
      setCaptureTargets(captures);
    } else {
      // Clicking empty square or enemy piece with no piece selected
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
    }
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
