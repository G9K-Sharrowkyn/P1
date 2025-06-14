// gameStateEffects.js
import { useEffect } from 'react';
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

export function useBotEffect({ vsBot, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClickRef }) {
  useEffect(() => {
    if (
      vsBot &&
      currentTurn === 'black' &&
      !winner &&
      moveIndex === moveHistory.length - 1 &&
      handleClickRef.current
    ) {
      runBotMove({ board, archerTargets, handleClick: handleClickRef.current });
    }
  }, [board, currentTurn, vsBot, winner, moveHistory.length, moveIndex, archerTargets, handleClickRef]);
}

export function useDualBotEffect({ enabled, currentTurn, winner, moveIndex, moveHistory, board, archerTargets, handleClickRef }) {
  useEffect(() => {
    if (
      enabled &&
      handleClickRef.current &&
      !winner &&
      moveIndex === moveHistory.length - 1
    ) {
      runBotMove({ board, archerTargets, handleClick: handleClickRef.current });
    }
  }, [board, currentTurn, enabled, winner, moveHistory.length, moveIndex, archerTargets, handleClickRef]);
}
