import React from 'react';

const FontSelector = ({ onSelectFont }) => {
  const handleFontClick = (font) => {
    onSelectFont(font);
  };

  return (
    <div>
      <button onClick={() => handleFontClick('Arial, sans-serif')}>Arial</button>
      <button onClick={() => handleFontClick('Courier New, monospace')}>Courier</button>
      <button onClick={() => handleFontClick('Times New Roman, serif')}>Times New Roman</button>
    </div>
  );
};

export default FontSelector;
