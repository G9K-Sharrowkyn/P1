// Square.js
import React from 'react';

const oldPieceImages = {
  white: {
    emperor: require('../../assets/new chess files/a.png'),
    archer: require('../../assets/new chess files/c.png'),
    general: require('../../assets/new chess files/e.png'),
    cavalry: require('../../assets/new chess files/g.png'),
    guard: require('../../assets/new chess files/i.png'),
    infantry: require('../../assets/new chess files/k.png'),
  },
  black: {
    emperor: require('../../assets/new chess files/b.png'),
    archer: require('../../assets/new chess files/d.png'),
    general: require('../../assets/new chess files/f.png'),
    cavalry: require('../../assets/new chess files/h.png'),
    guard: require('../../assets/new chess files/j.png'),
    infantry: require('../../assets/new chess files/l.png'),
  }
};

const newPieceImages = {
  white: {
    emperor: require('../../assets/new chess files/Emperor_White.png'),
    archer: require('../../assets/new chess files/Archers_White.png'),
    general: require('../../assets/new chess files/General_White.png'),
    cavalry: require('../../assets/new chess files/Cavalry_White.png'),
    guard: require('../../assets/new chess files/Guards_White.png'),
    infantry: require('../../assets/new chess files/Infantry_White.png'),
  },
  black: {
    emperor: require('../../assets/new chess files/Emperor_Black.png'),
    archer: require('../../assets/new chess files/Archers_Black.png'),
    general: require('../../assets/new chess files/General_Black.png'),
    cavalry: require('../../assets/new chess files/Cavalry_Black.png'),
    guard: require('../../assets/new chess files/Guards_Black.png'),
    infantry: require('../../assets/new chess files/Infantry_Black.png'),
  }
};

const Square = ({
  piece,
  onClick,
  isSelected,
  isHighlighted,
  isCaptureTarget,
  isArcherTarget,
  useNewPieces,
  boardSize,
  useNewBoard,
  squareSize,
  style
}) => {
  const classes = [
    'huangjun-square',
    piece?.team,
    isSelected && 'selected',
    isHighlighted && 'highlighted',
    isCaptureTarget && 'capture-target',
    isArcherTarget && 'archer-target'
  ].filter(Boolean).join(' ');

  const squareStyle = {
    ...style,
    backgroundColor: useNewBoard ? 'transparent' : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    cursor: 'pointer',
    position: style?.position || 'relative',
    width: squareSize,
    height: squareSize,
    border: useNewBoard ? 'none' : undefined,
    boxShadow: useNewBoard ? 'none' : undefined,
  };

  // Both old and new pieces should visually match by scaling to 84x84px squares with margin
  const pieceMargin = squareSize * 0.03; // consistent margin
  const pieceSize = squareSize - 2 * pieceMargin;

  const pieceImages = useNewPieces ? newPieceImages : oldPieceImages;
  let pieceImgSrc = null;

  if (piece) {
    pieceImgSrc = pieceImages[piece.team]?.[piece.type];
  }

  return (
    <div
      className={classes}
      onClick={onClick}
      style={squareStyle}
    >
      {piece && pieceImgSrc && (
        <img
          src={pieceImgSrc}
          alt=""
          style={{
            width: pieceSize,
            height: pieceSize,
            objectFit: 'contain',
            pointerEvents: 'none',
            display: 'block',
            margin: 'auto'
          }}
        />
      )}
    </div>
  );
};

export default Square;