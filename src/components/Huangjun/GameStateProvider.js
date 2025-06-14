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
import { useArcherReadyEffect, useBotEffect, useAutoPlayEffect } from './gameStateEffects';

const GameStateProvider = ({ children, autoPlay = false }) => {
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
  useAutoPlayEffect({ autoPlay, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClick });

  useEffect(() => {
    if (autoPlay && winner) {
      const t = setTimeout(() => {
        setBoard(createInitialBoard());
        setSelected(null);
        setCurrentTurn('white');
        setEmperorHits({ white: 0, black: 0 });
        setWinner(null);
        setMoveHistory([]);
        setMoveIndex(-1);
        setHighlighted([]);
        setCaptureTargets([]);
        setArcherTargets([]);
        setCastlingRights({ white: true, black: true });
        setPendingCharge(null);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, winner]);

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
