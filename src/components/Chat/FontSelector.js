import React from 'react';

const FontSelector = ({ onSelectFont }) => {
  const handleFontClick = (font) => {
    onSelectFont(font);
  };

  return (
    <div>
      <button className="fontButton" onClick={() => handleFontClick('Arial, sans-serif')}>Arial</button>
      <button className="fontButton" onClick={() => handleFontClick('Courier New, monospace')}>Courier</button>
      <button className="fontButton" onClick={() => handleFontClick('Times New Roman, serif')}>Times New Roman</button>
    </div>
  );
};

export default FontSelector;
