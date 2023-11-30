import React, { useState, useEffect, useCallback } from 'react';
import TileMap from './TileMap';
import styles from './TileMap.css';

const directions = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
};

const keys = {
  38: directions.up,
  37: directions.left,
  39: directions.right,
  40: directions.down,
};

const TileMapMain = () => {
  const [position, setPosition] = useState({ x: -190, y: 34 });
  const [direction, setDirection] = useState('down');
  const [isWalking, setIsWalking] = useState(false);
  const gridSize = 66;

  const handleDpadPress = useCallback((newDirection) => {
    setDirection(newDirection);
    setIsWalking(true);
  }, []);

  const handleDpadRelease = useCallback(() => {
    setIsWalking(false);
  }, []);

  const mapStyle = {
    imageRendering: 'pixelated',
    backgroundImage: 'url(https://assets.codepen.io/21542/CameraDemoMap.png)',
    backgroundSize: '100%',
    width: `${13 * gridSize}px`,
    height: `${10 * gridSize}px`,
    position: 'absolute',
  };
  
const handleKeyDown = useCallback((event) => {
  const dir = keys[event.keyCode];
  if (dir) {
    setDirection(dir);
    setIsWalking(true);
  }
}, []);

const handleKeyUp = useCallback((event) => {
  if (keys[event.keyCode]) {
    setIsWalking(false);
  }
}, []);

  const placeCharacter = useCallback(() => {
    if (!isWalking) return;
  
    let newX = position.x;
    let newY = position.y;
    const speed = 0.5;
  
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
  
    const leftLimit = 0;
    const rightLimit = 11;
    const topLimit = 0;
    const bottomLimit = 7; 

    newX = Math.max(leftLimit, Math.min(newX, rightLimit));
    newY = Math.max(topLimit, Math.min(newY, bottomLimit));
  
    setPosition({ x: newX, y: newY });
  }, [position, direction, isWalking]);

  const characterStyle = {
    transform: `translate3d(${position.x * gridSize}px, ${position.y * gridSize}px, 0)`,
    width: `${2 * gridSize}px`,
    height: `${2 * gridSize}px`,
    position: 'absolute',
    overflow: 'hidden',
  };

  const characterSpritesheetStyle = {
    position: 'absolute',
    backgroundImage: 'url(https://assets.codepen.io/21542/DemoRpgCharacter.png)',
    backgroundSize: '100%',
    width: `${8 * gridSize}px`,
    height: `${8 * gridSize}px`,
  };

  const shadowStyle = {
    width: `${2 * gridSize}px`,
    height: `${2 * gridSize}px`,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundImage: 'url(https://assets.codepen.io/21542/DemoRpgCharacterShadow.png)',
    backgroundSize: '100%',
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const step = () => {
      placeCharacter();
      requestAnimationFrame(step);
    };
    const animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, placeCharacter]);

  return (
    <div className={styles.frame}>
      <div className={styles.camera} style={mapStyle}>
        <div className={`${styles.character} ${styles[direction]} ${isWalking ? styles.walking : ''}`} style={characterStyle}>
          <div style={shadowStyle}>
          </div>
          <div style={characterSpritesheetStyle}> 
          </div>
        </div>
        <TileMap />

        <div className={styles.dpad}>
          <button onMouseDown={() => handleDpadPress('up')} onMouseUp={handleDpadRelease}>Up</button>
          <button onMouseDown={() => handleDpadPress('down')} onMouseUp={handleDpadRelease}>Down</button>
          <button onMouseDown={() => handleDpadPress('left')} onMouseUp={handleDpadRelease}>Left</button>
          <button onMouseDown={() => handleDpadPress('right')} onMouseUp={handleDpadRelease}>Right</button>
        </div>
      </div>
    </div>
  );
};

export default TileMapMain;