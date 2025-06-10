// GameStateContext.js
import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { createInitialBoard } from './initialBoard';
import { isValidMove, isWithinBounds } from './movementRules';
import { archerCanSee, findArcherTargets, isArcherAlreadyTargeting } from './archerLogic';
import { TYPE_LETTER, RANK_NAMES } from './constants';

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
    const x = flipped ? 8 - xRaw : xRaw;
    const y = flipped ? 8 - yRaw : yRaw;

    if (winner || moveIndex !== moveHistory.length - 1) return;
    const piece = board[y][x];

    // Always allow switching selection to another piece of the current turn
    if (piece && piece.team === currentTurn) {
      // If already selected this piece, deselect
      if (selected && selected.x === x && selected.y === y) {
        clearSelection();
        return;
      }
      setSelected({ x, y });
      const moves = [];
      const captures = [];
      const isArcher = piece.type === 'archer';
      // For archers, show both possible moves (green) and possible attacks (red) if ready
      if (isArcher) {
        // Always show possible moves
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const tx = x + dx, ty = y + dy;
            if (isWithinBounds(tx, ty) && isValidMove(board, { x, y }, { x: tx, y: ty }, currentTurn)) {
              moves.push({ x: tx, y: ty });
            }
          }
        }
        // Show possible attacks (red) if ready
        const archerReadyTargets = archerTargets.filter(t =>
          t.from.x === x && t.from.y === y &&
          t.team === currentTurn &&
          t.readyIn <= 0
        );
        const validTargets = archerReadyTargets
          .map(t => ({ x: t.to.x, y: t.to.y }))
          .filter(t => {
            const target = board[t.y][t.x];
            return target && target.team !== currentTurn;
          });
        setHighlighted(moves);
        setCaptureTargets(validTargets);
        return;
      }
      // General: highlight all 9-square reach (like emperor, but not limited to 1-square)
      if (piece.type === 'general') {
        for (let dy = -8; dy <= 8; dy++) {
          for (let dx = -8; dx <= 8; dx++) {
            if (dx === 0 && dy === 0) continue;
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
        setHighlighted(moves);
        setCaptureTargets(captures);
        return;
      }
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
      setHighlighted(moves);
      setCaptureTargets(captures);
      return;
    }

    // If a piece is already selected, try to move/capture
    if (selected) {
      if (selected.x === x && selected.y === y) {
        clearSelection();
        return;
      }
      const from = selected, to = { x, y };
      const moving = board[from.y][from.x];
      const target = board[to.y][to.x];

      // Check if this is an archer attack (archer already selected, clicking on a capture target)
      const isArcherAttack = board[from.y][from.x].type === 'archer' && 
                         captureTargets.some(t => t.x === to.x && t.y === to.y) &&
                         archerTargets.some(t => 
                           t.from.x === from.x && t.from.y === from.y && 
                           t.to.x === to.x && t.to.y === to.y && 
                           t.readyIn <= 0 && t.team === currentTurn);
      
      if (isArcherAttack) {
        // Handle archer attack
        let newBoard = JSON.parse(JSON.stringify(board));
        // Remove the target piece
        newBoard[to.y][to.x] = null;
        
        // Update archer targets (remove this specific target)
        let archerTargetsNext = archerTargets.filter(t => 
          !(t.from.x === from.x && t.from.y === from.y && 
            t.to.x === to.x && t.to.y === to.y && 
            t.readyIn <= 0 && t.team === currentTurn)
        );
        
        setBoard(newBoard);
        setArcherTargets(archerTargetsNext);
        setCurrentTurn(t => t === 'white' ? 'black' : 'white');
        clearSelection();
        
        // Add to move history
        const notation = makeNotation('archer', from, to, true) + ' (strzał)';
        setMoveHistory(prev => [...prev, { board: newBoard, turn: currentTurn, notation }]);
        setMoveIndex(i => i + 1);
      }
      else if (isValidMove(board, from, to, currentTurn)) {
        let newBoard = JSON.parse(JSON.stringify(board));
        let archerTargetsNext = [...archerTargets];

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
          }
          // Ruch łucznika: szukaj celów w nowym położeniu!
          if (moving.type === 'archer') {
            const archer = { x: to.x, y: to.y };
            const targets = findArcherTargets(archer, newBoard, currentTurn);
            for (const targetPos of targets) {
              // Nie dodawaj duplikatów!
              if (!isArcherAlreadyTargeting(archerTargetsNext, archer, targetPos, currentTurn)) {
                archerTargetsNext.push({
                  from: { ...archer },
                  to: { ...targetPos },
                  team: currentTurn,
                  readyIn: 1, // Łucznik potrzebuje tylko 1 turę odpoczynku, po czym będzie gotowy do strzału
                });
              }
            }
          }
          // Specjalny przypadek: jeśli wróg wszedł w zasięg łucznika
          if (target && target.team !== currentTurn && target.type !== 'guard' && target.type !== 'emperor') {
            // Sprawdź czy po tym ruchu przeciwnik NIE wszedł w zasięg łuczników przeciwnika (czyli obecnego gracza!)
            for (let yAr = 0; yAr < 9; yAr++) {
              for (let xAr = 0; xAr < 9; xAr++) {
                const maybeArcher = newBoard[yAr][xAr];
                if (
                  maybeArcher &&
                  maybeArcher.type === 'archer' &&
                  maybeArcher.team !== currentTurn
                ) {
                  if (archerCanSee({ x: xAr, y: yAr }, to, newBoard)) {
                    if (!isArcherAlreadyTargeting(archerTargetsNext, { x: xAr, y: yAr }, to, maybeArcher.team)) {
                      archerTargetsNext.push({
                        from: { x: xAr, y: yAr },
                        to: { ...to },
                        team: maybeArcher.team,
                        readyIn: 0, // Gotowy od razu (łucznik już był na pozycji)
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
      }
    } else {
      if (piece && piece.team === currentTurn) {
        // Check if this is an archer with ready targets
        const isArcher = piece.type === 'archer';
        const archerReadyTargets = isArcher ? 
          archerTargets.filter(t => 
            t.from.x === x && t.from.y === y && 
            t.team === currentTurn && 
            t.readyIn <= 0
          ) : [];
        
        // If this is an archer with ready targets, show them for potential attack
        if (isArcher && archerReadyTargets.length > 0) {
          setSelected({ x, y });
          setHighlighted([]);
          setCaptureTargets([]);
          
          // Now handle the archer attack
          const attackablePieces = archerReadyTargets.map(t => ({ x: t.to.x, y: t.to.y }));
          
          // Check if targets still have pieces on them
          const validTargets = attackablePieces.filter(t => {
            const target = board[t.y][t.x];
            return target && target.team !== currentTurn;
          });
          
          setCaptureTargets(validTargets);
        } else {
          // Regular piece selection logic
          setSelected({ x, y });
          const moves = [];
          const captures = [];
          
          // For archers, we need special handling
          const isArcher = piece.type === 'archer';
          
          for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
              const tx = x + dx, ty = y + dy;
              if (isWithinBounds(tx, ty) && isValidMove(board, { x, y }, { x: tx, y: ty }, currentTurn)) {
                const targetSquare = board[ty][tx];
                
                // For archers, don't highlight enemy squares (they'll need to rest first)
                if (isArcher && targetSquare && targetSquare.team !== currentTurn) {
                  // Don't add to either list - archer can't capture directly
                } else if (targetSquare && targetSquare.team !== currentTurn) {
                  // This is a capture move
                  captures.push({ x: tx, y: ty });
                } else if (!targetSquare) {
                  // This is a movement-only square
                  moves.push({ x: tx, y: ty });
                }
              }
            }
          }
          
          setHighlighted(moves);
          setCaptureTargets(captures);
        }
      }
    }
  }, [
    board, currentTurn, selected, emperorHits, moveHistory.length, moveIndex, winner, flipped, archerTargets
  ]);

  // ==== Update archer ready status in new turn ====
  useEffect(() => {
    // In new turn: decrease readyIn counter for all archer targets
    setArcherTargets(prev => {
      if (!prev.length) return prev;
      // Just update readyIn counters, don't attack automatically
      return prev.map(shot => {
        if (shot.readyIn > 0) {
          return { ...shot, readyIn: shot.readyIn - 1 };
        }
        return shot;
      });
    });
    // eslint-disable-next-line
  }, [currentTurn]);

  // ===== BOT =====
  useEffect(() => {
    if (vsBot && currentTurn === 'black' && !winner && moveIndex === moveHistory.length - 1) {
      // First check if there are any archers with ready targets (priority action)
      const archerAttacks = [];
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          const p = board[y][x];
          if (p?.team === 'black' && p?.type === 'archer') {
            // Check if this archer has any ready targets
            const archerReadyTargets = archerTargets.filter(t => 
              t.from.x === x && t.from.y === y && 
              t.team === 'black' && 
              t.readyIn <= 0
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