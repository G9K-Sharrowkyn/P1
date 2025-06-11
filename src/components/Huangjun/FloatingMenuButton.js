// FloatingMenuButton.js
import React from 'react';

const FloatingMenuButton = ({ onClick }) => (
  <button
    className="fixed top-6 right-6 z-50 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-full shadow-xl transition-all duration-200"
    onClick={onClick}
    title="Show Menu"
  >
    Menu
  </button>
);

export default FloatingMenuButton;
