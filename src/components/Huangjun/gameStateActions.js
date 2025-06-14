// gameStateActions.js
import { clearSelection, makeNotation } from './boardUtils';
import { handleMove, handleArcherAttack, computeMoveHighlights } from './gameStateReducer';
import { archerCanSee, isTargetCurrentlyVisible } from './archerLogic';

/* ────────────────────────────────────────────────────────── */
/*  POMOCNICZA FUNKCJA DO SZARŻY KAWALERII                   */
/* ────────────────────────────────────────────────────────── */
function cavalryChargeTarget(from, to, board, team) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const next = { x: to.x + dx, y: to.y + dy };

  if (
    next.x >= 0 && next.x < 9 &&
    next.y >= 0 && next.y < 9
  ) {
    const pieceBehind = board[next.y][next.x];
    if (pieceBehind && pieceBehind.team !== team) {
      return next; // jest drugi wróg
    }
  }
  return null;
}

export function clearSelectionState(setSelected, setHighlighted, setCaptureTargets) {
  clearSelection(setSelected, setHighlighted, setCaptureTargets);
}

export function handleClickFactory({
  /*  ─── stan gry ─────────────────────── */
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
  /*  ─── NOWE: prawo roszady + szarża ── */
  castlingRights, setCastlingRights,
  pendingCharge, setPendingCharge
}) {
  return (xRaw, yRaw) => {
    const x = xRaw, y = yRaw;
    const piece = board[y][x];

    /* ───────── BLOKADA: trwa szarża, nie możesz ruszać innych figur ─────── */
    if (pendingCharge && piece && piece.team === currentTurn) {
      // pozwalamy tylko kliknąć swoją kawalerię (by zrezygnować)
      const cav = pendingCharge.cavalry;
      if (!(cav.x === x && cav.y === y)) return;
    }

    /* 1. MAMY JUŻ COŚ ZAZNACZONEGO ─────────────────────────────────────── */
    if (selected) {
      /* 1a. Klik na tę samą figurę – odznacz (lub zakończ szarżę) */
      if (selected.x === x && selected.y === y) {
        if (pendingCharge) {
          // gracz rezygnuje z drugiego uderzenia
          setPendingCharge(null);
          setCurrentTurn(t => (t === 'white' ? 'black' : 'white'));
        }
        clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        return;
      }

      const from = selected, to = { x, y };
      const moving = board[from.y][from.x];
      const target = board[to.y][to.x];

      const validCapture = captureTargets.find(c => c.x === x && c.y === y);
      const specialHighlight = highlighted.find(h => h.x === x && h.y === y && h.special);
      const isValidMove =
        highlighted.some(h => h.x === x && h.y === y) ||
        validCapture;

      /* 1b. Klik gdzieś indziej, ale to nielegalne (albo inna własna figura) */
      if (!isValidMove) {
        if (piece && piece.team === currentTurn) {
          // szybkie przełączenie zaznaczenia
          const { moves, captures } = computeMoveHighlights(piece, x, y, board, currentTurn, castlingRights);
          let finalCaptures = captures;
          if (piece.type === 'archer') {
            const readyArcherAttacks = archerTargets
              .filter(t =>
                t.from.x === x && t.from.y === y &&
                t.team === currentTurn && t.readyIn === 0
              )
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

        /* 1c. Specjalny atak łucznika (z uwzględnieniem obrażeń cesarza) */
      if (validCapture?.special === 'archer_attack') {
        const { newBoard, archerTargetsNext, notation } =
          handleArcherAttack({ board, currentTurn, archerTargets }, from, to);

         let finalBoard = newBoard;


        if (target?.type === 'emperor') {
          const nh = { ...emperorHits };
          nh[target.team] += 1;
          setEmperorHits(nh);
          if (nh[target.team] >= 3) {
            setWinner(currentTurn);
          } else {
            // Emperor survives the hit - keep him on the board
            finalBoard = board;
          }
        }

        setBoard(finalBoard);
        setArcherTargets(archerTargetsNext);
        setMoveHistory(prev => [
          ...prev.slice(0, moveIndex + 1),
          { board: finalBoard, turn: currentTurn, notation }
        ]);
        setMoveIndex(i => i + 1);
        setCurrentTurn(t => (t === 'white' ? 'black' : 'white'));
        clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        return;
      }

      /* 1d. Specjalne ruchy (swap / charge) ───────────────────────────── */
      if (specialHighlight?.special === 'swap' || validCapture?.special === 'swap') {
        /* ── ROSZADA ───────────────── */
        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[to.y][to.x] = moving;
        newBoard[from.y][from.x] = target;

        // wyłączamy prawo roszady dla tej strony
        setCastlingRights(cr => ({ ...cr, [currentTurn]: false }));
        // oznaczamy, że obie figury się ruszyły (jeśli to śledzisz gdzie indziej)

        setBoard(newBoard);
        setMoveHistory(prev => [
          ...prev.slice(0, moveIndex + 1),
          {
            board: newBoard,
            turn: currentTurn,
            notation: `${moving.type} swaps with Guard`
          }
        ]);
        setMoveIndex(i => i + 1);
        setCurrentTurn(t => (t === 'white' ? 'black' : 'white'));
        clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        return;
      }

      if (validCapture?.special === 'charge') {
        /* ── DRUGIE UDERZENIE KAWALERII ───────────────── */
        const newBoard = JSON.parse(JSON.stringify(board));
        // usuwamy figurę „po drodze”
        if (validCapture.through) {
          newBoard[validCapture.through.y][validCapture.through.x] = null;
        }
        // koń wyjeżdża na drugi cel
        newBoard[to.y][to.x] = moving;
        newBoard[from.y][from.x] = null;

        setBoard(newBoard);
        setMoveHistory(prev => [
          ...prev.slice(0, moveIndex + 1),
          {
            board: newBoard,
            turn: currentTurn,
            notation: `${moving.type} charges through enemy line`
          }
        ]);
        setMoveIndex(i => i + 1);
        setPendingCharge(null);               // szarża skończona
        setCurrentTurn(t => (t === 'white' ? 'black' : 'white'));
        clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
        return;
      }

      /* 1e. ZWYKŁY RUCH / ZBICIE ──────────────────────────────────────── */
      const {
        newBoard,
        archerTargetsNext
      } = handleMove(
        { board, currentTurn, archerTargets, moveHistory },
        from,
        to,
        null
      );

      /* 1e-i  Szarża kawalerii: sprawdzamy czy jest drugi cel */
      if (
        moving.type === 'cavalry' &&
        target && target.team !== currentTurn   // pierwsze zbicie
      ) {
        const next = cavalryChargeTarget(from, to, newBoard, moving.team);
        if (next) {
          // ZOSTAWIAMY TĘ SAMĄ TURĘ
          setBoard(newBoard);
          setArcherTargets(archerTargetsNext);
          setSelected({ x: to.x, y: to.y });
          setHighlighted([]); // niebieskich ruchów brak
          setCaptureTargets([
            { ...next, special: 'charge', through: { x: to.x, y: to.y } }
          ]);
          setPendingCharge({
            cavalry: { x: to.x, y: to.y },
            targets: [{ ...next, through: { x: to.x, y: to.y } }]
          });
          /*  moveHistory – zapisujemy pierwsze zbicie od razu  */
          setMoveHistory(prev => [
            ...prev.slice(0, moveIndex + 1),
            { board: newBoard, turn: currentTurn,
              notation: makeNotation(moving.type, from, to, true) }
          ]);
          setMoveIndex(i => i + 1);
          // brak zmiany currentTurn
          return;
        }
      }

      /* 1e-ii  Zwykłe konsekwencje ruchu */
      if (target?.type === 'emperor' && target.team !== currentTurn) {
        const nh = { ...emperorHits };
        nh[target.team] += 1;
        
        if (nh[target.team] >= 3) {
          setEmperorHits(nh);
          setWinner(currentTurn);
        } else {
          setEmperorHits(nh);
          // Emperor survives - cancel the move
          setCurrentTurn(t => (t === 'white' ? 'black' : 'white'));
          clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
          return;
        }
      }

      /* 1e-iii  Cesarskie ruchy wygaszają prawo roszady */
      if (moving.type === 'emperor') {
        setCastlingRights(cr => ({ ...cr, [currentTurn]: false }));
        if (target && target.team !== currentTurn) {
          const nh = { ...emperorHits };
          nh[moving.team] += 1;
          setEmperorHits(nh);
          if (nh[moving.team] >= 3) setWinner(target.team);
        }
      }

      setBoard(newBoard);
      setArcherTargets(archerTargetsNext);
      setMoveHistory(prev => [
        ...prev.slice(0, moveIndex + 1),
        {
          board: newBoard,
          turn: currentTurn,
          notation: makeNotation(
            moving.type,
            from,
            to,
            target !== null
          )
        }
      ]);
      setMoveIndex(i => i + 1);
      setCurrentTurn(t => (t === 'white' ? 'black' : 'white'));
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);

      /* ───────────────────────────────────────────────────────────────── */

    /* 2. BRAK ZAZNACZENIA – klikamy figurę własną ───────────────────── */
    } else if (piece && piece.team === currentTurn) {
      setSelected({ x, y });
      const { moves, captures } = computeMoveHighlights(
        piece,
        x,
        y,
        board,
        currentTurn,
        castlingRights
      );
      setHighlighted(moves);

      let finalCaptures = captures;
      if (piece.type === 'archer') {
        const readyArcherAttacks = archerTargets
          .filter(t =>
            t.from.x === x && t.from.y === y &&
            t.team === currentTurn && t.readyIn === 0
          )
          .map(t => ({ ...t.to, special: 'archer_attack' }));
        finalCaptures = [...captures, ...readyArcherAttacks];
      }
      setCaptureTargets(finalCaptures);

    /* 3. Klik pustego pola / wroga bez zaznaczenia ──────────────────── */
    } else {
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
    }
  };
}

/* ───────── UNDO / REDO – bez zmian, tylko czyszczenie pendingCharge ─── */

export function handleUndoFactory({
  moveIndex, setMoveIndex,
  moveHistory, setBoard,
  setCurrentTurn,
  setSelected, setHighlighted, setCaptureTargets,
  setPendingCharge
}) {
  return () => {
    if (moveIndex > 0) {
      const prev = moveHistory[moveIndex - 1];
      setBoard(prev.board);
      setMoveIndex(mi => mi - 1);
      setCurrentTurn(prev.turn);
      setPendingCharge(null);
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
    }
  };
}

export function handleRedoFactory({
  moveIndex, setMoveIndex,
  moveHistory, setBoard,
  setCurrentTurn,
  setSelected, setHighlighted, setCaptureTargets,
  setPendingCharge
}) {
  return () => {
    if (moveIndex + 1 < moveHistory.length) {
      const next = moveHistory[moveIndex + 1];
      setBoard(next.board);
      setMoveIndex(mi => mi + 1);
      setCurrentTurn(next.turn === 'white' ? 'black' : 'white');
      setPendingCharge(null);
      clearSelectionState(setSelected, setHighlighted, setCaptureTargets);
    }
  };
}

/* ───────── Pozostałe fabryki bez zmian ─────────────────────────────── */
export function toggleVsBotFactory(setVsBot) {
  return () => setVsBot(prev => !prev);
}

export function toggleFlippedFactory(setFlipped) {
  return () => setFlipped(prev => !prev);
}
