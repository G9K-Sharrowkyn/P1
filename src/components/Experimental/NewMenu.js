import React, { useState, useRef, useEffect } from 'react';
import "./NewMenu.css";

const NewMenu = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [prevPercentage, setPrevPercentage] = useState(0);
  const trackRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setPrevPercentage(parseFloat(trackRef.current.style.transform.replace('translate(', '').replace('%, -50%)', '')) || 0);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    if (!trackRef.current) return;

    const mouseDelta = startX - e.clientX;
    const maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100;
    let nextPercentageUnconstrained = prevPercentage + percentage;
    let nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    trackRef.current.style.transform = `translate(${nextPercentage}%, -50%)`;
    const images = trackRef.current.getElementsByClassName('image');
    for (const image of images) {
      image.style.objectPosition = `${100 + nextPercentage}% center`;
    }
  };

//https://www.youtube.com/watch?v=PkADl0HubMY

  useEffect(() => {
    const trackElement = trackRef.current;

    return () => {
    };
  }, []); 

  return (
    <div
      id="image-track"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={trackRef}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
    </div>
  );
};

export default NewMenu;
