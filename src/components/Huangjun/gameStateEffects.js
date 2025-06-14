// gameStateEffects.js
import { useEffect, useRef } from 'react';
import { runBotMove } from './botLogic';

export function useArcherReadyEffect(currentTurn, setArcherTargets) {
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
  }, [currentTurn, setArcherTargets]);
}

export function useBotEffect({ vsBot, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClick }) {
  const thinkingRef = useRef(false);
  useEffect(() => {
    if (
      vsBot &&
      currentTurn === 'black' &&
      !winner &&
      moveIndex === moveHistory.length - 1 &&
      !thinkingRef.current
    ) {
      thinkingRef.current = true;
      runBotMove({
        board,
        archerTargets,
        handleClick,
        team: 'black',
        onFinish: () => {
          thinkingRef.current = false;
        }
      });
    }
  }, [board, currentTurn, vsBot, winner, moveHistory.length, moveIndex, handleClick, archerTargets]);
}

export function useDualBotEffect({ enabled, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClick }) {
  const thinkingRef = useRef(false);
  useEffect(() => {
    if (
      enabled &&
      handleClick &&
      !winner &&
      moveIndex === moveHistory.length - 1 &&
      !thinkingRef.current
    ) {
      thinkingRef.current = true;
      runBotMove({
        board,
        archerTargets,
        handleClick,
        team: currentTurn,
        onFinish: () => {
          thinkingRef.current = false;
        }
      });
    }
  }, [board, currentTurn, enabled, winner, moveHistory.length, moveIndex, handleClick, archerTargets]);
}
