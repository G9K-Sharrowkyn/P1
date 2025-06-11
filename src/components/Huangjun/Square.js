// Square.js
import React from 'react';
import { oldPieceImages, newPieceImages } from './Imports';

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