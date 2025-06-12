// GameStateContext.js
import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { createInitialBoard } from './initialBoard';
import { TYPE_LETTER, RANK_NAMES } from './constants';
import { makeNotation, clearSelection, getBoardLabels } from './boardUtils';
import { runBotMove } from './botLogic';
import { handleMove, handleArcherAttack, computeMoveHighlights } from './gameStateReducer';
import { archerCanSee } from './archerLogic';

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [board, setBoard] = useState(createInitialBoard());
  const [selected, setSelected] = useState(null);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [emperorHits, setEmperorHits] = useState({ white: 0, black: 0 });
  const [winner, setWinner] = useState(null);
  const [vsBot, setVsBot] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [highlighted, setHighlighted] = useState([]);
  const [captureTargets, setCaptureTargets] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [archerTargets, setArcherTargets] = useState([]); // [{from,to,team,readyIn}]

  const clearSelectionState = () => {
    clearSelection(setSelected, setHighlighted, setCaptureTargets);
  };
  // ======= HANDLE CLICK =======
  const handleClick = useCallback((xRaw, yRaw) => {
    const x = xRaw, y = yRaw;
    const piece = board[y][x];

    // Get global archer attack targets
    const globalArcherAttackTargets = archerTargets
      .filter(t => t.team === currentTurn && t.readyIn === 0 && board[t.from.y][t.from.x]?.lastMoved !== moveHistory.length)
      .map(t => ({ x: t.to.x, y: t.to.y }))
      .filter(t => {
        const target = board[t.y][t.x];
        return target && target.team !== currentTurn;
      });

    // Handle selected piece
    if (selected) {
      if (selected.x === x && selected.y === y) {
        clearSelectionState();
        setCaptureTargets(globalArcherAttackTargets);
        return;
      }

      const from = selected, to = { x, y };
      const moving = board[from.y][from.x];

      // Check for archer attack
      const isArcherAttack = moving.type === 'archer' &&
        globalArcherAttackTargets.some(t => t.x === to.x && t.y === to.y) &&
        archerTargets.some(t =>
          t.from.x === from.x && t.from.y === from.y &&
          t.to.x === to.x && t.to.y === to.y &&
          t.readyIn === 0 && t.team === currentTurn &&
          board[from.y][from.x].lastMoved !== moveHistory.length &&
          archerCanSee(from, to, board)
        );

      if (isArcherAttack) {
        const { newBoard, archerTargetsNext, notation } = handleArcherAttack({ board, currentTurn, archerTargets }, from, to);
        setBoard(newBoard);
        setArcherTargets(archerTargetsNext);
        setMoveHistory(prev => [...prev, { board: newBoard, turn: currentTurn, notation }]);
        setMoveIndex(i => i + 1);
        setCurrentTurn(t => t === 'white' ? 'black' : 'white');
        clearSelectionState();
        return;
      }

      const target = board[to.y][to.x];
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
      clearSelectionState();
      return;
    }

    // Handle new piece selection
    if (piece && piece.team === currentTurn) {
      setSelected({ x, y });
      const { moves, captures } = computeMoveHighlights(piece, x, y, board, currentTurn);
      const allCaptures = [
        ...captures,
        ...globalArcherAttackTargets.filter(t => !captures.some(c => c.x === t.x && c.y === t.y))
      ];
      setHighlighted(moves);
      setCaptureTargets(allCaptures);
      return;
    }

    // Handle empty square click
    clearSelectionState();
    setCaptureTargets(globalArcherAttackTargets);
  }, [
    board, currentTurn, selected, moveHistory.length, emperorHits, archerTargets
  ]);
  // ==== Update archer ready status in new turn ====
  useEffect(() => {
    setArcherTargets(prev => {
      if (!prev.length) return prev;
      return prev.map(shot => {
        if (shot.readyIn > 0) {
          return { ...shot, readyIn: shot.readyIn - 1 };
        }
        return shot;
      });
    });
  }, [currentTurn]);

  // ===== BOT =====
  useEffect(() => {
    if (vsBot && currentTurn === 'black' && !winner && moveIndex === moveHistory.length - 1) {
      runBotMove({ board, archerTargets, handleClick });
    }
  }, [board, currentTurn, vsBot, winner, moveHistory.length, moveIndex, handleClick, archerTargets]);
  // ===== UNDO/REDO =====
  const handleUndo = () => {
    if (moveIndex > 0) {
      const prev = moveHistory[moveIndex - 1];
      setBoard(prev.board);
      setMoveIndex(mi => mi - 1);
      setCurrentTurn(prev.turn);
      // Note: archerTargets are not stored in history
      clearSelectionState();
    }
  };

  const handleRedo = () => {
    if (moveIndex + 1 < moveHistory.length) {
      const next = moveHistory[moveIndex + 1];
      setBoard(next.board);
      setMoveIndex(mi => mi + 1);
      setCurrentTurn(next.turn === 'white' ? 'black' : 'white');
      clearSelectionState();
    }
  };

  const toggleVsBot = useCallback(() => {
    setVsBot(prev => !prev);
  }, []);

  const toggleFlipped = useCallback(() => {
    setFlipped(prev => !prev);
  }, []);

  // Create derived board state
  const { rowLabels, colLabels } = getBoardLabels(flipped);
  const renderBoard = flipped ? [...board].reverse() : board;

  const value = {
    // Game state
    board,
    renderBoard,
    selected,
    currentTurn,
    emperorHits,
    winner,
    vsBot,
    moveHistory,
    moveIndex,
    highlighted,
    captureTargets,
    flipped,
    archerTargets,
    rowLabels,
    colLabels,
    
    // Actions
    handleClick,
    handleUndo,
    handleRedo,
    toggleVsBot,
    toggleFlipped,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateContext;