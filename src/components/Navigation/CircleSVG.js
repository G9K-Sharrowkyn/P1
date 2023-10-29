import React, { useState, useEffect } from 'react';

const CircleSVG = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const svgWidth = 800;
  const svgHeight = 700;

  useEffect(() => {
    const updateCursorPosition = (e) => {
      setCursorPosition({ x: e.clientX /1.6, y: e.clientY /1.45 });
    };

    window.addEventListener('mousemove', updateCursorPosition);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
    };
  }, []);

  const maxDisplacementLargest = 100;
  const maxDisplacementLarge = 75;
  const maxDisplacementMedium = 50;
  const maxDisplacementSmall = 25;

  const centerX = svgWidth / 1.9;
  const centerY = svgHeight / 1.9;

  const angle = Math.atan2(cursorPosition.y - centerY , cursorPosition.x - centerX);
  const distanceToCursor = Math.hypot(cursorPosition.x - centerX, cursorPosition.y - centerY);

  const limitedDisplacementLargest = Math.min(maxDisplacementLargest, distanceToCursor);
  const limitedDisplacementLarge = Math.min(maxDisplacementLarge, distanceToCursor);
  const limitedDisplacementMedium = Math.min(maxDisplacementMedium, distanceToCursor);
  const limitedDisplacementSmall = Math.min(maxDisplacementSmall, distanceToCursor);

  const displacementLargestX = centerX + limitedDisplacementLargest * Math.cos(angle);
  const displacementLargestY = centerY + limitedDisplacementLargest * Math.sin(angle);

  const displacementLargeX = centerX + limitedDisplacementLarge * Math.cos(angle);
  const displacementLargeY = centerY + limitedDisplacementLarge * Math.sin(angle);

  const displacementMediumX = centerX + limitedDisplacementMedium * Math.cos(angle);
  const displacementMediumY = centerY + limitedDisplacementMedium * Math.sin(angle);

  const displacementSmallX = centerX + limitedDisplacementSmall * Math.cos(angle);
  const displacementSmallY = centerY + limitedDisplacementSmall * Math.sin(angle);

  return (
    <svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
<circle
  cx={displacementLargestX}
  cy={displacementLargestY}
  r={160}
  fill="none"
  stroke="blue"
  strokeWidth="6"
  strokeDasharray="144, 25, 57, 66" 
  strokeDashoffset="0"
  className="rotating-circle"
/>
<circle
  cx={displacementLargeX}
  cy={displacementLargeY}
  r={120}
  fill="none"
  stroke="red"
  strokeWidth="4"
  strokeDasharray="124, 12, 45, 88" 
  strokeDashoffset="0"
  className="rotating-circle"
/>
<circle
  cx={displacementMediumX}
  cy={displacementMediumY}
  r={80}
  fill="none"
  stroke="blue"
  strokeWidth="4"
  strokeDasharray="124, 12, 45, 88" 
  strokeDashoffset="0"
  className="rotating-circle"
/>
<circle
  cx={displacementSmallX}
  cy={displacementSmallY}
  r={40}
  fill="none"
  stroke="red"
  strokeWidth="4"
  strokeDasharray="14, 12, 45, 28" 
  strokeDashoffset="0"
  className="rotating-circle"
/>
    </svg>
  );
};

export default CircleSVG;
