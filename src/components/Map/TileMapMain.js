import React, { useState, useEffect } from 'react';
import TileMap from './TileMap';

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
  const [position, setPosition] = useState({ x: 5, y: 3 });
  const [direction, setDirection] = useState('down');
  const [isWalking, setIsWalking] = useState(false);
  const [isOnDoors, setIsOnDoors] = useState(false);
  const gridSize = 66;

  const handleDpadPress = (newDirection) => {
    setDirection(newDirection);
    setIsWalking(true);
  }

  const handleDpadRelease = () => {
    setIsWalking(false);
  }

  const [currentMap, setCurrentMap] = useState('map1');


  const mapStyle1 = {
    imageRendering: 'pixelated',
    backgroundImage: 'url(https://assets.codepen.io/21542/CameraDemoMap.png)',
    backgroundSize: '100%',
    width: `${13 * gridSize}px`,
    height: `${10 * gridSize}px`,
    position: 'absolute',
  };

  const mapStyle2 = {
    imageRendering: 'pixelated',
    backgroundImage: 'url(https://st3.depositphotos.com/1340907/17689/v/1600/depositphotos_176890584-stock-illustration-pixel-art-neighborhood.jpg)',
    backgroundSize: '100%',
    width: `${13 * gridSize}px`,
    height: `${10 * gridSize}px`,
    position: 'absolute',
  };

  const doorsPosition = { x: 0, y: 0 };
  const doorsStyle = {
    width: `${3 * gridSize}px`,
    height: `${3 * gridSize}px`,
    position: 'absolute',
    backgroundImage: `url(https://art.pixilart.com/0fc84f0c3d4c39f.png)`,
    backgroundSize: '100%',
  };

  const handleKeyDown = (event) => {
    const dir = keys[event.keyCode];
    if (!dir) {
      return;
    }
    setDirection(dir);
    setIsWalking(true);
  }

  const handleKeyUp = (event) => {
    if (!keys[event.keyCode]) {
      return;
    }
    setIsWalking(false);
  }

  const placeCharacter = () => {
    if (!isWalking) {
      return;
    }
  
    let newX = position.x;
    let newY = position.y;
    const speed = 0.2;
  
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

    if (Math.round(newX) === doorsPosition.x && Math.round(newY) === doorsPosition.y) {
      setIsOnDoors(true);
    } else {
      setIsOnDoors(false);
    }
  };

  const teleportCharacter = () => {
    setCurrentMap(currentMap === 'map1' ? 'map2' : 'map1');
    const newMapStartPosition = { x: 1, y: 1 };
    setPosition(newMapStartPosition);
    setIsOnDoors(false);
  };

  const characterStyle = {
    transform: `translate3d(${position.x * gridSize}px, ${position.y * gridSize}px, 0)`,
    width: `${2 * gridSize}px`,
    height: `${2 * gridSize}px`,
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 3,
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
  }, [position, direction, isWalking]);

  const handleSomething = (e) => {
    const direction = e.currentTarget.dataset.direction;
    handleDpadPress(direction);
  }

  return (
    <div>
      <div style={currentMap === 'map1' ? mapStyle1 : mapStyle2}>
        <div style={characterStyle}>
          <div style={shadowStyle}></div>
          <div style={characterSpritesheetStyle}></div>
        </div>
        <div style={doorsStyle}></div>
        <TileMap />
  
        <div style={{ position: 'absolute', bottom: '630px' }}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div>
              <button className="w-44 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl" data-direction="up" onMouseDown={handleSomething} onMouseUp={handleDpadRelease}>Up</button>
            </div>
            <div className="flex justify-center space-x-4">
              <button className="w-44 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl" data-direction="left" onMouseDown={handleSomething} onMouseUp={handleDpadRelease}>Left</button>
              <button className="w-44 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl" data-direction="down" onMouseDown={handleSomething} onMouseUp={handleDpadRelease}>Down</button>
              <button className="w-44 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl" data-direction="right" onMouseDown={handleSomething} onMouseUp={handleDpadRelease}>Right</button>
            </div>
          </div>
  
          {isOnDoors && (
            <div className="mt-4 flex justify-center">
              <button className="w-44 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl" onClick={teleportCharacter}>Teleport to New Map</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TileMapMain;