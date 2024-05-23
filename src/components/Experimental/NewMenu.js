import React, { useState, useRef } from 'react';
import '../../assets/css/NewMenu.css';

const ImageTrack = () => {
  const trackRef = useRef(null);
  const [mouseDownAt, setMouseDownAt] = useState(0);
  const [prevPercentage, setPrevPercentage] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
    'https://images.unsplash.com/photo-1610194352361-4c81a6a8967e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
    'https://images.unsplash.com/photo-1618202133208-2907bebba9e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    'https://images.unsplash.com/photo-1495805442109-bf1cf975750b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    'https://images.unsplash.com/photo-1548021682-1720ed403a5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
  ];

  const handleOnDown = (e) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    setMouseDownAt(clientX);
  };

  const handleOnUp = () => {
    setMouseDownAt(0);
    setPrevPercentage(percentage);
  };

  const handleOnMove = (e) => {
    if (mouseDownAt === 0) return;

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const mouseDelta = mouseDownAt - clientX;
    const maxDelta = window.innerWidth / 2;
    const newPercentage = (mouseDelta / maxDelta) * -220;
    const nextPercentageUnconstrained = prevPercentage + newPercentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
    
    let adjustedPercentage = nextPercentage;
    
    if (adjustedPercentage > 30) {
      adjustedPercentage = 30;
    }
    
    setPercentage(adjustedPercentage);

    trackRef.current.style.transform = `translateX(${nextPercentage}%)`;

    for (const image of trackRef.current.children) {
      image.style.objectPosition = `${100 + nextPercentage}% center`;
    }
  };

  return (
    <div
      className="image-track"
      ref={trackRef}
      onMouseDown={handleOnDown}
      onTouchStart={handleOnDown}
      onMouseUp={handleOnUp}
      onTouchEnd={handleOnUp}
      onMouseMove={handleOnMove}
      onTouchMove={handleOnMove}
    >
      {images.map((src, index) => (
        <img
          key={index}
          className="image"
          src={src}
          alt={`View ${index}`}
        />
      ))}
    </div>
  );
};

export default ImageTrack;