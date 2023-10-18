import React from 'react';

const FontSelector = ({ onSelectFont }) => {
  const handleFontClick = (font) => {
    onSelectFont(font);
  };

  return (
    <div>
      <button onClick={() => handleFontClick('Arial')}>Arial</button>
      <button onClick={() => handleFontClick('Helvetica')}>Helvetica</button>
      <button onClick={() => handleFontClick('Times New Roman')}>Times New Roman</button>
    </div>
  );
};

export default FontSelector;
