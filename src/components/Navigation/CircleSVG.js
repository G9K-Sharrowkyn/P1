import React, { useState, useEffect } from 'react';
import '../../assets/css/CircleSVG.css'; 

const CircleSVG = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [dashPatterns, setDashPatterns] = useState({
    largest: '',
    largest2: '',
    large: '',
    large2: '',
    medium: '',
    medium2: '',
    small: '',
    small2: '',
  });
  const [rotation, setRotation] = useState({
    largest: 0,
    large: 0,
    medium: 0,
    small: 0,
    largest2: 0,
    large2: 0,
    medium2: 0,
    small2: 0,
  });

  const svgWidth = 800;
  const svgHeight = 800;
  const center = { x: svgWidth / 2, y: svgHeight / 2 };
  const maxDisplacement = 350;
  const rotationSpeed = 0.2;
  const generateDashPattern = (min, max) => {
    let pattern = '';
    for (let i = 0; i < 5; i++) {
      const dashLength = Math.random() * (max - min) + min;
      const spaceLength = Math.random() * (max - min) + min;
      pattern += `${dashLength} ${spaceLength}, `;
    }
    return pattern.slice(0, -2);
  };

  const points = [
    { cx: 100, cy: 100, url: 'http://localhost:3000/contactform', id: 'point1' },
  ];

  const handleClick = (url) => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    setDashPatterns({
      largest: generateDashPattern(40, 100),
      large: generateDashPattern(30, 80),
      medium: generateDashPattern(20, 60),
      small: generateDashPattern(10, 40),
      largest2: generateDashPattern(40, 100),
      large2: generateDashPattern(30, 80),
      medium2: generateDashPattern(20, 60),
      small2: generateDashPattern(10, 40),
    });

    const updateCursorPosition = (e) => {
      const svgElement = document.getElementById('circle-svg');
      const rect = svgElement.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', updateCursorPosition);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
    };
  }, []);

  useEffect(() => {
    const animateRotation = () => {
      setRotation(prevRotation => ({
        largest: prevRotation.largest + rotationSpeed * 2,
        large: prevRotation.large + rotationSpeed * 2.5,
        medium: prevRotation.medium + rotationSpeed * 1.5,
        small: prevRotation.small + rotationSpeed * 1,
        largest2: prevRotation.largest2 + rotationSpeed * 2.5,
        large2: prevRotation.large2 + rotationSpeed * 1.5,
        medium2: prevRotation.medium2 + rotationSpeed * 2,
        small2: prevRotation.small2 + rotationSpeed * 1.5,
      }));
    };

    const frameId = requestAnimationFrame(animateRotation);

    console.log(rotation);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [rotation]);

  const calculateDisplacement = (scale) => {
    const deltaX = cursorPosition.x - center.x;
    const deltaY = cursorPosition.y - center.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);

    const displacement = Math.min(distance, maxDisplacement) * scale;
    const displacementX = Math.cos(angle) * displacement;
    const displacementY = Math.sin(angle) * displacement;

    return { x: displacementX, y: displacementY };
  };

  return (
    <svg id="circle-svg" width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
     <defs>
        <filter id="glow-largest" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        className="neon-red"
        filter="url(#glow-largest)"
        cx={center.x + calculateDisplacement(0.4).x}
        cy={center.y + calculateDisplacement(0.4).y}
        r={160}
        strokeWidth="3"
        fill="transparent"
        strokeDasharray={dashPatterns.largest}
        strokeDashoffset={rotation.largest}
      />
      <circle
        className="neon-green"
        filter="url(#glow-largest)"
        cx={center.x + calculateDisplacement(0.3).x}
        cy={center.y + calculateDisplacement(0.3).y}
        r={120}
        strokeWidth="5"
        fill="transparent"
        strokeDasharray={dashPatterns.large}
        strokeDashoffset={rotation.large}
      />
      <circle
        className="neon-blue"
        filter="url(#glow-largest)"      
        cx={center.x + calculateDisplacement(0.2).x}
        cy={center.y + calculateDisplacement(0.2).y}
        r={80}
        strokeWidth="5"
        fill="transparent"
        strokeDasharray={dashPatterns.medium}
        strokeDashoffset={rotation.medium}
      />
      <circle
        className="neon-orange"
        filter="url(#glow-largest)"        
        cx={center.x + calculateDisplacement(0.1).x}
        cy={center.y + calculateDisplacement(0.1).y}
        r={40}
        strokeWidth="5"
        fill="transparent"
        strokeDasharray={dashPatterns.small}
        strokeDashoffset={rotation.small}
      />
      <circle
        className="neon-red"
        filter="url(#glow-largest)"
        cx={center.x + calculateDisplacement(0.4).x}
        cy={center.y + calculateDisplacement(0.4).y}
        r={160}
        strokeWidth="1"
        fill="transparent"
        strokeDasharray={dashPatterns.largest2}
        strokeDashoffset={rotation.largest2}
      />
      <circle
        className="neon-green"
        filter="url(#glow-largest)"
        cx={center.x + calculateDisplacement(0.3).x}
        cy={center.y + calculateDisplacement(0.3).y}
        r={120}
        strokeWidth="2"
        fill="transparent"
        strokeDasharray={dashPatterns.large2}
        strokeDashoffset={rotation.large2}
      />
      <circle
        className="neon-blue"
        filter="url(#glow-largest)"      
        cx={center.x + calculateDisplacement(0.2).x}
        cy={center.y + calculateDisplacement(0.2).y}
        r={80}
        strokeWidth="2"
        fill="transparent"
        strokeDasharray={dashPatterns.medium2}
        strokeDashoffset={rotation.medium2}
      />
      <circle
        className="neon-orange"
        filter="url(#glow-largest)"        
        cx={center.x + calculateDisplacement(0.1).x}
        cy={center.y + calculateDisplacement(0.1).y}
        r={40}
        strokeWidth="2"
        fill="transparent"
        strokeDasharray={dashPatterns.small2}
        strokeDashoffset={rotation.small2}
      />
      {points.map((point) => (
        <circle
          key={point.id}
          className="glowing-point"
          filter="url(#glow-point)"
          cx={point.cx}
          cy={point.cy}
          r="5"
          fill="url(#gradient)"
          onClick={() => handleClick(point.url)}
          cursor="pointer"
        />
      ))}
    </svg>
  );
};

export default CircleSVG;
