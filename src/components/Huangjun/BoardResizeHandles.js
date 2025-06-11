// BoardResizeHandles.js
import React from 'react';
import { getResizeDelta, clampBoardSize } from './boardResize';

const handleDirections = [
  { dir: 'se', className: 'right-0 bottom-0 items-end justify-end cursor-nwse-resize', svgClass: '', rotate: '' },
  { dir: 'ne', className: 'right-0 top-0 items-start justify-end cursor-nesw-resize', svgClass: 'rotate-90', rotate: '90' },
  { dir: 'sw', className: 'left-0 bottom-0 items-end justify-start cursor-nesw-resize', svgClass: '-rotate-90', rotate: '-90' },
  { dir: 'nw', className: 'left-0 top-0 items-start justify-start cursor-nwse-resize', svgClass: 'rotate-180', rotate: '180' },
];

const BoardResizeHandles = ({ boardSize, setBoardSize }) => {
  const onResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    let startX = e.clientX;
    let startY = e.clientY;
    let startSize = boardSize;
    const onMouseMove = (moveEvent) => {
      let dx = moveEvent.clientX - startX;
      let dy = moveEvent.clientY - startY;
      let delta = getResizeDelta(direction, dx, dy);
      let newSize = clampBoardSize(startSize + delta);
      setBoardSize(newSize);
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <>
      {handleDirections.map(h => (
        <div
          key={h.dir}
          className={`absolute w-8 h-8 flex z-20 select-none ${h.className}`}
          style={{ [h.dir.includes('n') ? 'top' : 'bottom']: 0, [h.dir.includes('e') ? 'right' : 'left']: 0 }}
          onMouseDown={e => onResize(e, h.dir)}
          title={`Resize board (${h.dir})`}
        >
          <svg width="32" height="32" className={`text-gray-500 ${h.svgClass}`} viewBox="0 0 32 32">
            <polyline points="8,32 32,32 32,8" fill="none" stroke="currentColor" strokeWidth="3" />
            <polyline points="20,32 32,20" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
      ))}
    </>
  );
};

export default BoardResizeHandles;
