// GameStateContext.js
import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { createInitialBoard } from './initialBoard';
import { isValidMove, isWithinBounds, isPathClear } from './movementRules';
import { archerCanSee, findArcherTargets, isArcherAlreadyTargeting } from './archerLogic';
import { TYPE_LETTER, RANK_NAMES, DIRS_8 } from './constants';

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

  // ======= UTIL =======
  const makeNotation = (type, from, to, hit = false) => {
    const letter = TYPE_LETTER[type];
    const f = `${from.x + 1}${RANK_NAMES[from.y]}`;
    const t = `${to.x + 1}${RANK_NAMES[to.y]}`;
    return hit ? `${letter}${f}×${t}` : `${letter}${f}-${t}`;
  };

  const clearSelection = () => {
    setSelected(null);
    setHighlighted([]);
    setCaptureTargets([]);
  };

  // ======= HANDLE CLICK =======
  const handleClick = useCallback((xRaw, yRaw) => {
    const x = xRaw, y = yRaw;
    const piece = board[y][x];

    // 1. Compute all valid archer attack targets for the current turn (global, for red highlight)
    const globalArcherAttackTargets = archerTargets
      .filter(t => t.team === currentTurn && t.readyIn === 0 && board[t.from.y][t.from.x]?.lastMoved !== moveHistory.length)
      .map(t => ({ x: t.to.x, y: t.to.y }))
      .filter(t => {
        const target = board[t.y][t.x];
        return target && target.team !== currentTurn;
      });

    // 2. If a piece is selected, handle move/capture logic
    if (selected) {
      if (selected.x === x && selected.y === y) {
        clearSelection();
        setHighlighted([]);
        setCaptureTargets(globalArcherAttackTargets);
        return;
      }
      const from = selected, to = { x, y };
      const moving = board[from.y][from.x];
      const target = board[to.y][to.x];
      // Archer attack logic
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
        // Handle archer attack
        let newBoard = JSON.parse(JSON.stringify(board));
        // Remove the target piece
        newBoard[to.y][to.x] = null;
          // Update archer targets (remove this specific target)
        let archerTargetsNext = archerTargets.filter(t => 
          !(t.from.x === from.x && t.from.y === from.y && 
            t.to.x === to.x && t.to.y === to.y && 
            t.readyIn === 0 && t.team === currentTurn) // Must be exactly 0
        );
        
        setBoard(newBoard);
        setArcherTargets(archerTargetsNext);
        setCurrentTurn(t => t === 'white' ? 'black' : 'white');
        clearSelection();
        
        // Add to move history
        const notation = makeNotation('archer', from, to, true) + ' (strzał)';
        setMoveHistory(prev => [...prev, { board: newBoard, turn: currentTurn, notation }]);
        setMoveIndex(i => i + 1);
      }      else if (isValidMove(board, from, to, currentTurn)) {
        let newBoard = JSON.parse(JSON.stringify(board));
        let archerTargetsNext = [...archerTargets];          // Track when pieces move by storing the current move index
        if (board[from.y][from.x]) {
          newBoard[from.y][from.x].lastMoved = moveHistory.length;
          // Clear any targeting from the moved piece
          archerTargetsNext = archerTargetsNext.filter(t => 
            !(t.from.x === from.x && t.from.y === from.y && t.team === currentTurn)
          );
        }

        if (target?.type === 'emperor' && target.team !== currentTurn) {
          const nh = { ...emperorHits };
          nh[target.team] += 1;
          setEmperorHits(nh);
          if (nh[target.team] >= 3) setWinner(currentTurn);

          const notation = makeNotation(moving.type, from, to, true);
          setMoveHistory(prev => [...prev, { board: newBoard, turn: currentTurn, notation }]);
          setMoveIndex(i => i + 1);
        } else {
          // PROMOCJA piechoty
          if (moving.type === 'infantry' && (to.y === 0 || to.y === 8)) {
            newBoard[from.y][from.x].type = 'general';
          }          // Archer movement: look for targets in new position and set waiting period!
          if (moving.type === 'archer') {
            const archer = { x: to.x, y: to.y };
            const targets = findArcherTargets(archer, newBoard, currentTurn);
            // After archer moves, add targets with 1 turn wait
            for (const targetPos of targets) {
              // Don't add duplicates!
              if (!isArcherAlreadyTargeting(archerTargetsNext, archer, targetPos, currentTurn)) {
                archerTargetsNext.push({
                  from: { ...archer },
                  to: { ...targetPos },
                  team: currentTurn,
                  readyIn: 1, // Must wait 1 turn after moving
                });
              }
            }
          }          // Special case: if an enemy piece moves into archer range
          if (target && target.team !== currentTurn && target.type !== 'guard' && target.type !== 'emperor') {
            // Check if after this move the piece enters range of enemy archers
            for (let yAr = 0; yAr < 9; yAr++) {
              for (let xAr = 0; xAr < 9; xAr++) {
                const maybeArcher = newBoard[yAr][xAr];
                if (
                  maybeArcher &&
                  maybeArcher.type === 'archer' &&
                  maybeArcher.team !== currentTurn &&
                  // Only consider archers that haven't moved this turn
                  maybeArcher.lastMoved !== moveHistory.length
                ) {
                  if (archerCanSee({ x: xAr, y: yAr }, to, newBoard)) {
                    if (!isArcherAlreadyTargeting(archerTargetsNext, { x: xAr, y: yAr }, to, maybeArcher.team)) {
                      archerTargetsNext.push({
                        from: { x: xAr, y: yAr },
                        to: { ...to },
                        team: maybeArcher.team,
                        readyIn: 1, // Must wait 1 turn when enemy moves into range
                      });
                    }
                  }
                }
              }
            }
          }
          // Gwardia: podwójna eliminacja
          if (target?.type === 'guard' && target.team !== currentTurn) {
            newBoard[to.y][to.x] = null;
            newBoard[from.y][from.x] = null;
          } else {
            newBoard[to.y][to.x] = newBoard[from.y][from.x];
            newBoard[from.y][from.x] = null;
          }
          const notation = makeNotation(moving.type, from, to, false);
          setMoveHistory(prev => [...prev, { board: newBoard, turn: currentTurn, notation }]);
          setMoveIndex(i => i + 1);
        }
        setBoard(newBoard);
        setArcherTargets(archerTargetsNext);
        setCurrentTurn(t => t === 'white' ? 'black' : 'white');
        clearSelection();
      } else {
        clearSelection();
        setHighlighted([]);
        setCaptureTargets(globalArcherAttackTargets);
      }
      return;
    }

    // 3. If a piece is clicked (not already selected)
    if (piece && piece.team === currentTurn) {
      setSelected({ x, y });
      let moves = [];
      let captures = [];
      // Compute valid moves and captures for this piece
      if (piece.type === 'archer') {
        // Archer movement (straight lines, 1-3 squares)
        for (const dir of DIRS_8) {
          for (let dist = 1; dist <= 3; dist++) {
            const tx = x + dir.dx * dist, ty = y + dir.dy * dist;
            if (!isWithinBounds(tx, ty)) break;
            if (!isPathClear(board, { x, y }, { x: tx, y: ty })) break;
            if (board[ty][tx]) break;
            moves.push({ x: tx, y: ty });
          }
        }
        // Archer cannot capture by moving
      } else {
        // Other pieces: highlight valid moves/captures
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const tx = x + dx, ty = y + dy;
            if (isWithinBounds(tx, ty) && isValidMove(board, { x, y }, { x: tx, y: ty }, currentTurn)) {
              const targetSquare = board[ty][tx];
              if (targetSquare && targetSquare.team !== currentTurn) {
                captures.push({ x: tx, y: ty });
              } else if (!targetSquare) {
                moves.push({ x: tx, y: ty });
              }
            }
          }
        }
      }
      // Merge this piece's valid captures with global archer attack targets
      const allCaptures = [
        ...captures,
        ...globalArcherAttackTargets.filter(t => !captures.some(c => c.x === t.x && c.y === t.y))
      ];
      setHighlighted(moves);
      setCaptureTargets(allCaptures);
      return;
    }

    // 4. If nothing is selected and empty square is clicked, just show global archer attacks
    clearSelection();
    setHighlighted([]);
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
      // First check if there are any archers with ready targets (priority action)
      const archerAttacks = [];
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          const p = board[y][x];
          if (p?.team === 'black' && p?.type === 'archer') {            // Check if this archer has any ready targets            
            const archerReadyTargets = archerTargets.filter(t => 
              t.from.x === x && t.from.y === y && 
              t.team === 'black' && 
              t.readyIn === 0 // Must be exactly 0
            );
            
            if (archerReadyTargets.length > 0) {
              // Find valid targets (enemy pieces still on the board)
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
      
      // If we have archer attacks, randomly pick one to execute
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
                if (isWithinBounds(to.x, to.y) && isValidMove(board, { x, y }, to, 'black')) {
                  // Don't allow archer direct captures
                  if (p.type === 'archer') {
                    const targetPiece = board[to.y][to.x];
                    if (targetPiece && targetPiece.team !== 'black') {
                      continue; // Skip this move - archer can't capture directly
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
  }, [board, currentTurn, vsBot, winner, moveHistory.length, moveIndex, handleClick]);

  // ===== COFANIE =====
  const handleUndo = () => {
    if (moveIndex > 0) {
      const prev = moveHistory[moveIndex - 1];
      setBoard(prev.board);
      setMoveIndex(mi => mi - 1);
      setCurrentTurn(prev.turn);
      // UWAGA: archerTargets nie są zapisywane w historii — przy cofnięciu mogą powstać "dziury" w logice łuczników (możesz dodać zapamiętywanie jeśli zależy Ci na tym)
    }
  };

  const handleRedo = () => {
    if (moveIndex + 1 < moveHistory.length) {
      const nxt = moveHistory[moveIndex + 1];
      setBoard(nxt.board);
      setMoveIndex(mi => mi + 1);
      setCurrentTurn(nxt.turn === 'white' ? 'black' : 'white');
    }
  };

  const toggleVsBot = () => {
    setVsBot(prev => !prev);
  };

  const toggleFlipped = () => {
    setFlipped(prev => !prev);
  };

  // Create a derived state for the rendered board
  const renderBoard = flipped ? [...board].reverse() : board;
  const rowLabels = flipped
    ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    : ["9", "8", "7", "6", "5", "4", "3", "2", "1"];
  const colLabels = flipped ? [...RANK_NAMES].reverse() : RANK_NAMES;

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