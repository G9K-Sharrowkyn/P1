import React, { useState, useCallback, useEffect } from 'react';
import { GameStateContext } from './GameStateContext';
import { createInitialBoard } from './initialBoard';
import { getBoardLabels, getFlippedCoordinates } from './boardUtils';
import {
  handleClickFactory,
  handleUndoFactory,
  handleRedoFactory,
  toggleVsBotFactory,
  toggleFlippedFactory,
  clearSelectionState
} from './gameStateActions';
import { useArcherReadyEffect, useBotEffect, useDualBotEffect } from './gameStateEffects';

const GameStateProvider = ({ children, aiVsAi = false }) => {
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
  const [archerTargets, setArcherTargets] = useState([]);
  const [castlingRights, setCastlingRights] = useState({ white: true, black: true });
  const [pendingCharge, setPendingCharge] = useState(null);

  // Effects
  useArcherReadyEffect(currentTurn, setArcherTargets);

  useEffect(() => {
    if (aiVsAi && winner) {
      const moves = moveHistory.slice(0, moveIndex + 1).map(m => m.notation);
      fetch('http://localhost:2002/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner, moves })
      }).catch(err => console.error('save game error', err));
    }
  }, [aiVsAi, winner, moveHistory, moveIndex]);

  // Handlers
  const handleClick = useCallback(
    handleClickFactory({
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
      archerTargets, setArcherTargets,
      castlingRights, setCastlingRights,
    pendingCharge, setPendingCharge
  }),
    [board, selected, currentTurn, emperorHits, winner, vsBot, moveHistory, moveIndex, highlighted, captureTargets, flipped, archerTargets, castlingRights, pendingCharge]
  );

  const handleBoardClick = useCallback(
    (x, y) => {
      const ui = flipped ? getFlippedCoordinates(x, y) : { x, y };
      handleClick(ui.x, ui.y);
    },
    [handleClick, flipped]
  );

  // Bot effects use board coordinates
  useBotEffect({ vsBot, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClick: handleBoardClick });
  useDualBotEffect({ enabled: aiVsAi, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClick: handleBoardClick });

  const handleUndo = useCallback(
  handleUndoFactory({ moveIndex, setMoveIndex, moveHistory, setBoard, setCurrentTurn, setSelected, setHighlighted, setCaptureTargets }),
    [moveIndex, moveHistory]
  );
  const handleRedo = useCallback(
  handleRedoFactory({ moveIndex, setMoveIndex, moveHistory, setBoard, setCurrentTurn, setSelected, setHighlighted, setCaptureTargets, setPendingCharge }),
    [moveIndex, moveHistory]
  );
  const toggleVsBot = useCallback(toggleVsBotFactory(setVsBot), []);
  const toggleFlipped = useCallback(toggleFlippedFactory(setFlipped), []);

  const { rowLabels, colLabels } = getBoardLabels(flipped);
  const renderBoard = flipped
    ? board.slice().reverse().map(r => [...r].reverse())
    : board;

  const toDisplay = ({ x, y }) =>
    flipped ? getFlippedCoordinates(x, y) : { x, y };

  const displaySelected = selected ? toDisplay(selected) : null;
  const uniq = (arr, keyFn) => {
    const map = new Map();
    arr.forEach(item => {
      const key = keyFn(item);
      if (!map.has(key)) map.set(key, item);
    });
    return Array.from(map.values());
  };

  const displayHighlighted = uniq(
    highlighted.map(h => ({ ...toDisplay(h), special: h.special })),
    h => `${h.x}-${h.y}-${h.special || ''}`
  );

  const displayCaptureTargets = uniq(
    captureTargets.map(c => ({ ...toDisplay(c), special: c.special })),
    c => `${c.x}-${c.y}-${c.special || ''}`
  );
  const displayArcherTargets = archerTargets.map(t => ({
    ...t,
    from: toDisplay(t.from),
    to: toDisplay(t.to)
  }));

  const value = {
    board,
    renderBoard,
    selected: displaySelected,
    currentTurn,
    emperorHits,
    winner,
    vsBot,
    moveHistory,
    moveIndex,
    highlighted: displayHighlighted,
    captureTargets: displayCaptureTargets,
    flipped,
    archerTargets: displayArcherTargets,
    rowLabels,
    colLabels,
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

export default GameStateProvider;
