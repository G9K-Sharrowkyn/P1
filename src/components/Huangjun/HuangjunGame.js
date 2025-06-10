import React from 'react';
import Board from './Board';

const HuangjunGame = ({ onBackToMenu }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black items-start justify-start">
      <Board onBackToMenu={onBackToMenu} />
    </div>
  );
};

export default HuangjunGame;
