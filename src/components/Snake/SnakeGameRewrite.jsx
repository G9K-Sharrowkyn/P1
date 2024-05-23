import React, { useState, useEffect, useCallback } from 'react';
import './SnakeGame.css';
import GameOver from './GameOver.jsx';

const SnakeGame = (props) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [blockWidth, setBlockWidth] = useState(0);
  const [blockHeight, setBlockHeight] = useState(0);
  const [gameLoopTimeout, setGameLoopTimeout] = useState(200);
  const [timeoutId, setTimeoutId] = useState(0);
  const [startSnakeSize, setStartSnakeSize] = useState(0);
  const [snake, setSnake] = useState([]);
  const [apple, setApple] = useState({});
  const [direction, setDirection] = useState('right');
  const [directionChanged, setDirectionChanged] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [snakeColor, setSnakeColor] = useState(props.snakeColor || getRandomColor());
  const [appleColor, setAppleColor] = useState(props.appleColor || getRandomColor());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('snakeHighScore')) || 0);
  const [newHighScore, setNewHighScore] = useState(false);
};

useEffect(() => {
    initGame();
    const handleKeyDownListener = (event) => handleKeyDown(event);
    window.addEventListener('keydown', handleKeyDownListener);
    const loop = gameLoop();
    return () => {
      window.removeEventListener('keydown', handleKeyDownListener);
      clearTimeout(loop);
    };
  }, [initGame, handleKeyDown, gameLoop]);

  const initGame = useCallback(() => {
    let percentageWidth = props.percentageWidth || 40;
    let parentWidth = document.getElementById('GameBoard').parentElement.offsetWidth;
    let width = parentWidth * (percentageWidth / 50);
    width -= width % 30;
    if (width < 30) width = 30;
    let height = (width / 3) * 2;
    let blockWidth = width / 30;
    let blockHeight = height / 20;
  
    setWidth(width);
    setHeight(height);
    setBlockWidth(blockWidth);
    setBlockHeight(blockHeight);
  
    let startSnakeSize = props.startSnakeSize || 6;
    let snake = [];
    let Xpos = width / 2;
    let Ypos = height / 2;
    snake.push({ Xpos, Ypos });
    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= blockWidth;
      snake.push({ Xpos, Ypos });
    }
  
    setStartSnakeSize(startSnakeSize);
    setSnake(snake);
  
    let appleXpos =
      Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth;
    let appleYpos =
      Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight;
  
    while (appleYpos === snake[0].Ypos) {
      appleYpos =
        Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight;
    }
  
    setApple({ Xpos: appleXpos, Ypos: appleYpos });
  }, [props.percentageWidth, props.startSnakeSize]); 

setWidth(width);
setHeight(height);
setBlockWidth(blockWidth);
setBlockHeight(blockHeight);
setStartSnakeSize(startSnakeSize);
setSnake(snake);
setApple({ Xpos: appleXpos, Ypos: appleYpos });

const gameLoop = useCallback(() => {
    const timeoutId = setTimeout(() => {
      if (!isGameOver) {
        moveSnake();
        tryToEatSnake();
        tryToEatApple();
        setDirectionChanged(false);
      }
  
      gameLoop();
    }, gameLoopTimeout);

    setTimeoutId(timeoutId);
  }, [isGameOver, gameLoopTimeout, moveSnake, tryToEatSnake, tryToEatApple]);
  
  useEffect(() => {
    gameLoop();
  
    return () => clearTimeout(timeoutId);
  }, [gameLoop]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [timeoutId, handleKeyDown]); 

  const resetGame = useCallback(() => {
    let currentWidth = width; 
    let currentHeight = height; 
    let currentBlockWidth = blockWidth; 
    let currentBlockHeight = blockHeight; 
    let currentApple = apple; 
  
    let newSnake = [];
    let Xpos = currentWidth / 2;
    let Ypos = currentHeight / 2;
    newSnake.push({ Xpos, Ypos });
    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= currentBlockWidth;
      newSnake.push({ Xpos, Ypos });
    }
  
    let newAppleXpos, newAppleYpos;
    do {
      newAppleXpos =
        Math.floor(Math.random() * ((currentWidth - currentBlockWidth) / currentBlockWidth + 1)) *
        currentBlockWidth;
      newAppleYpos =
        Math.floor(Math.random() * ((currentHeight - currentBlockHeight) / currentBlockHeight + 1)) *
        currentBlockHeight;
    } while (isAppleOnSnake(newAppleXpos, newAppleYpos)); 

    setSnake(newSnake);
    setApple({ Xpos: newAppleXpos, Ypos: newAppleYpos });
  }, [width, height, blockWidth, blockHeight, apple, startSnakeSize, isAppleOnSnake]);

setSnake(newSnake);
setApple({ Xpos: newAppleXpos, Ypos: newAppleYpos });
setDirection('right');
setDirectionChanged(false);
setIsGameOver(false);
setGameLoopTimeout(200);
setSnakeColor(getRandomColor()); 
setAppleColor(getRandomColor());
setScore(0);
setNewHighScore(false);

const getRandomColor = useCallback(() => {
    const hexa = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += hexa[Math.floor(Math.random() * 16)];
    }
    return color;
  }, []);

  const moveSnake = useCallback(() => {
    let newSnake = [...snake];
    let previousPartX = newSnake[0].Xpos;
    let previousPartY = newSnake[0].Ypos;
    let tmpPartX, tmpPartY;
    let newHead = moveHead(snake[0], direction, blockWidth, blockHeight);
    newSnake[0] = newHead;
    for (let i = 1; i < newSnake.length; i++) {
      tmpPartX = newSnake[i].Xpos;
      tmpPartY = newSnake[i].Ypos;
      newSnake[i].Xpos = previousPartX;
      newSnake[i].Ypos = previousPartY;
      previousPartX = tmpPartX;
      previousPartY = tmpPartY;
    }
  
    setSnake(newSnake);
  }, [snake, direction, blockWidth, blockHeight, moveHead]);

  const tryToEatApple = useCallback(() => {
    setSnake((currentSnake) => {
      let newSnake = [...currentSnake];
      let head = newSnake[0];
  
      if (head.Xpos === apple.Xpos && head.Ypos === apple.Ypos) {
        let newApple = { ...apple };
  
        newSnake.push({ Xpos: apple.Xpos, Ypos: apple.Ypos });
  
        do {
          newApple.Xpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
          newApple.Ypos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
        } while (isAppleOnSnake(newApple, newSnake));
  
        setApple(newApple);
  
        setScore((currentScore) => {
          const newScore = currentScore + 1;
          if (newScore > highScore) {
            localStorage.setItem('snakeHighScore', newScore.toString());
            setHighScore(newScore);
            setNewHighScore(true);
          }
          return newScore;
        });
  
        setGameLoopTimeout((currentTimeout) => (currentTimeout > 25 ? currentTimeout - 0.5 : currentTimeout));
  
        return newSnake;
      }
  
      return currentSnake;
    });
  }, [apple, width, height, blockWidth, blockHeight, highScore, setApple, setScore, setHighScore, setNewHighScore, setGameLoopTimeout, isAppleOnSnake]);

  const tryToEatSnake = useCallback(() => {
    setSnake((currentSnake) => {
      for (let i = 1; i < currentSnake.length; i++) {
        if (currentSnake[0].Xpos === currentSnake[i].Xpos && currentSnake[0].Ypos === currentSnake[i].Ypos) {
          setIsGameOver(true);
          return currentSnake; 
        }
      }
      return currentSnake;
    });
  }, [setSnake, setIsGameOver]);
  
  const isAppleOnSnake = useCallback((appleXpos, appleYpos, snake) => {
    for (let i = 0; i < snake.length; i++) {
      if (appleXpos === snake[i].Xpos && appleYpos === snake[i].Ypos) {
        return true;
      }
    }
    return false;
  }, []);

  const moveHead = useCallback((head, direction, blockWidth, blockHeight, width, height) => {
    switch (direction) {
      case 'left':
        head.Xpos = head.Xpos <= 0 ? width - blockWidth : head.Xpos - blockWidth;
        break;
      case 'up':
        head.Ypos = head.Ypos <= 0 ? height - blockHeight : head.Ypos - blockHeight;
        break;
      case 'right':
        head.Xpos = head.Xpos >= width - blockWidth ? 0 : head.Xpos + blockWidth;
        break;
      case 'down':
        head.Ypos = head.Ypos >= height - blockHeight ? 0 : head.Ypos + blockHeight;
        break;
      default:
        break;
    }
    return head;
  }, []);

  const handleKeyDown = (event) => {
    if (isGameOver && event.keyCode === 32) {
      resetGame();
      return;
    }
  
    if (directionChanged) return;
  
    switch (event.keyCode) {
      case 37:
      case 65:
        setDirection('left');
        break;
      case 38:
      case 87:
        setDirection('up');
        break;
      case 39:
      case 68:
        setDirection('right');
        break;
      case 40:
      case 83:
        setDirection('down');
        break;
      default:

        break;
    }
      
        setDirectionChanged(true);
      };

      const goLeft = () => {
        setDirection(prevDirection => prevDirection === 'right' ? 'right' : 'left');
      };
      
      const goUp = () => {
        setDirection(prevDirection => prevDirection === 'down' ? 'down' : 'up');
      };
      
      const goRight = () => {
        setDirection(prevDirection => prevDirection === 'left' ? 'left' : 'right');
      };
      
      const goDown = () => {
        setDirection(prevDirection => prevDirection === 'up' ? 'up' : 'down');
      };

      return (
        <div
          id="GameBoard"
          style={{
            width: width,
            height: height,
            borderWidth: width / 50,
          }}
        >
          {snake.map((snakePart, index) => (
            <div
              key={index}
              className="Block"
              style={{
                width: blockWidth,
                height: blockHeight,
                left: snakePart.Xpos,
                top: snakePart.Ypos,
                background: snakeColor,
              }}
            />
          ))}
          <div
            className="Block"
            style={{
              width: blockWidth,
              height: blockHeight,
              left: apple.Xpos,
              top: apple.Ypos,
              background: appleColor,
            }}
          />
          <div id="Score" style={{ fontSize: width / 20 }}>
            HIGH-SCORE: {highScore}&ensp;&ensp;&ensp;&ensp;SCORE: {score}
          </div>
        </div>
      );

      
export default SnakeGame
