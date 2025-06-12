// GameStateContext.js
import React, { createContext, useContext } from 'react';

export const GameStateContext = createContext();
export const useGameState = () => useContext(GameStateContext);