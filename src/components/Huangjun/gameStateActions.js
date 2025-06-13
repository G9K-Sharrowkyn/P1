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
      
      const validCapture = captureTargets.find(c => c.x === x && c.y === y);
      const isValidMove = 
        highlighted.some(h => h.x === x && h.y === y) ||
        validCapture;
      
      if (!isValidMove) {
        // If the click is not a valid move, check if it's a different piece of the same team
        // to allow for quick re-selection. Otherwise, clear selection.
        if (piece && piece.team === currentTurn) {
          const { moves, captures } = computeMoveHighlights(piece, x, y, board, currentTurn);
          let finalCaptures = captures;
          if (piece.type === 'archer') {
            const readyArcherAttacks = archerTargets
              .filter(t => t.from.x === x && t.from.y === y && t.team === currentTurn && t.readyIn === 0)
              .map(t => ({ ...t.to, special: 'archer_attack' }));
            finalCaptures = [...captures, ...readyArcherAttacks];
          }
          setSelected({ x, y });
          setHighlighted(moves);
          setCaptureTargets(finalCaptures);
        } else {
          clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        }
        return;
      }
      
      // Handle Archer Attack
      if (validCapture?.special === 'archer_attack') {
        const { newBoard, archerTargetsNext, notation } = handleArcherAttack({ board, currentTurn, archerTargets }, from, to);
        
        // Check for emperor hits from archer attack
        if (target?.type === 'emperor') {
          const nh = { ...emperorHits };
          nh[target.team] += 1;
          setEmperorHits(nh);
          if (nh[target.team] >= 3) setWinner(currentTurn);
        }

        setBoard(newBoard);
        setArcherTargets(archerTargetsNext);
        setMoveHistory(prev => [...prev.slice(0, moveIndex + 1), { board: newBoard, turn: currentTurn, notation }]);
        setMoveIndex(i => i + 1);
        setCurrentTurn(t => t === 'white' ? 'black' : 'white');
        clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        return;
      }

      // Handle special moves
      let special = null;
      if (validCapture?.special) {
        special = validCapture.special;
        if (special === 'swap') {
          // Emperor-Guard swap
          const newBoard = JSON.parse(JSON.stringify(board));
          // Swap positions
          newBoard[to.y][to.x] = moving;
          newBoard[from.y][from.x] = target;
          setBoard(newBoard);
          setMoveHistory(prev => [...prev, { 
            board: newBoard, 
            turn: currentTurn, 
            notation: `${moving.type} swaps with Guard` 
          }]);
          setMoveIndex(i => i + 1);
          setCurrentTurn(t => t === 'white' ? 'black' : 'white');
          clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
          return;
        } else if (special === 'charge') {
          // Cavalry charge
          const newBoard = JSON.parse(JSON.stringify(board));
          // Remove first target
          if (validCapture.through) {
            newBoard[validCapture.through.y][validCapture.through.x] = null;
          }
          // Move cavalry to final position (second target's position)
          newBoard[to.y][to.x] = moving;
          newBoard[from.y][from.x] = null;
          setBoard(newBoard);
          setMoveHistory(prev => [...prev, { 
            board: newBoard, 
            turn: currentTurn, 
            notation: `${moving.type} charges through enemy line` 
          }]);
          setMoveIndex(i => i + 1);
          setCurrentTurn(t => t === 'white' ? 'black' : 'white');
          clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
          return;
        }
      }

      // Handle emperor hits
      const { newBoard, archerTargetsNext } = handleMove({ board, currentTurn, archerTargets, moveHistory }, from, to, special ? { type: special, ...validCapture } : null);
      
      // Check for emperor hits on normal move
      if (target?.type === 'emperor' && target.team !== currentTurn) {
        const nh = { ...emperorHits };
        nh[target.team] += 1;
        setEmperorHits(nh);
        if (nh[target.team] >= 3) setWinner(currentTurn);
      }

      setBoard(newBoard);
      setArcherTargets(archerTargetsNext);
      setMoveHistory(prev => [...prev.slice(0, moveIndex + 1), { board: newBoard, turn: currentTurn, notation: makeNotation(moving.type, from, to, target !== null) }]);
      setMoveIndex(i => i + 1);
      setCurrentTurn(t => t === 'white' ? 'black' : 'white');
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);

    } else if (piece && piece.team === currentTurn) {
      // Selecting a new piece
      setSelected({ x, y });
      const { moves, captures } = computeMoveHighlights(piece, x, y, board, currentTurn);
      setHighlighted(moves);

      let finalCaptures = captures;
      // If an archer is selected, find its available attack targets
      if (piece.type === 'archer') {
        const readyArcherAttacks = archerTargets
          .filter(t => t.from.x === x && t.from.y === y && t.team === currentTurn && t.readyIn === 0)
          .map(t => ({ ...t.to, special: 'archer_attack' }));
        finalCaptures = [...captures, ...readyArcherAttacks];
      }
      setCaptureTargets(finalCaptures);
      
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
