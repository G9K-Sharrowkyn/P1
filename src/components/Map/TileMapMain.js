import React, { useState, useEffect, useRef } from 'react';
import styles from './TileMap.module.css';

const TileMapMain = () => {
  const [position, setPosition] = useState({ x: 90, y: 34 });
  const [direction, setDirection] = useState('down');
  const [isWalking, setIsWalking] = useState(false);
  const mapRef = useRef(null);


  const keys = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right',
  };

  const handleKeyDown = (event) => {
    const dir = keys[event.keyCode];
    if (dir) {
      setDirection(dir);
      setIsWalking(true);
    }
  };

  const handleKeyUp = (event) => {
    const dir = keys[event.keyCode];
    if (dir) {
      setIsWalking(false);
    }
  };


  const placeCharacter = () => {
    let newX = position.x;
    let newY = position.y;
    const speed = 1;

    if (isWalking) {
      switch (direction) {
        case 'right':
          newX += speed;
          break;
        case 'left':
          newX -= speed;
          break;
        case 'down':
          newY += speed;
          break;
        case 'up':
          newY -= speed;
          break;
        default:
          break;
      }

      const leftLimit = -8;
      const rightLimit = (16 * 11) + 8;
      const topLimit = -8 + 32;
      const bottomLimit = (16 * 7);

      newX = Math.max(leftLimit, Math.min(newX, rightLimit));
      newY = Math.max(topLimit, Math.min(newY, bottomLimit));

      setPosition({ x: newX, y: newY });
    }
  };

  useEffect(() => {
    const step = () => {
      placeCharacter();
      requestAnimationFrame(step);
    };
    const animationFrameId = requestAnimationFrame(step);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [position, direction, isWalking]);

  const characterStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  };

  const mapStyle = {
    transform: `translate3d(${-position.x}px, ${-position.y}px, 0)`
  };

  const directions = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right',
  };

  return (
    <div className={styles.frame}>
      <div className={styles.camera} ref={mapRef} style={mapStyle}>
        <div className={`${styles.character} ${styles[direction]} ${isWalking ? styles.walking : ''}`} style={characterStyle}>
        </div>
      </div>
    </div>
  );
};

export default TileMapMain;