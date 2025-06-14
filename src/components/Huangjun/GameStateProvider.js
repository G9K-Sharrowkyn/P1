import React, { useState, useCallback, useEffect } from 'react';
import { GameStateContext } from './GameStateContext';
import { createInitialBoard } from './initialBoard';
import { getBoardLabels } from './boardUtils';
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
  useBotEffect({ vsBot, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClick: null }); // handleClick set below
  useDualBotEffect({ enabled: aiVsAi, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClick: null });

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

  // Now that handleClick is defined, re-run bot effect with correct handleClick
  useBotEffect({ vsBot, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClick });
  useDualBotEffect({ enabled: aiVsAi, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClick });

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
  const renderBoard = flipped ? [...board].reverse() : board;

  const value = {
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
