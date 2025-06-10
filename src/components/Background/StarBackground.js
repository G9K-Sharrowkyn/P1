import React, { useEffect, useState, useMemo } from 'react';
import './StarBackground.css';

function generateBoxShadows(numberOfStars, width, height) {
  let boxShadow = '';
  for (let i = 0; i < numberOfStars; i++) {
    const x = Math.round(Math.random() * width);
    const y = Math.round(Math.random() * (height * 2));
    // Randomize the star color slightly for more realism
    const alpha = Math.random() * 0.3 + 0.7; // 0.7-1.0 opacity
    const color = `rgba(255, 255, 255, ${alpha})`;
    boxShadow += `${x}px ${y}px ${color}, `;
  }
  return boxShadow.slice(0, -2);
}

const StarBackground = () => {
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  // Optimize performance with useMemo to prevent recalculating on every render
  const { smallStars, mediumStars, bigStars } = useMemo(() => {
    return {
      smallStars: generateBoxShadows(2100, dimensions.width, dimensions.height),
      mediumStars: generateBoxShadows(500, dimensions.width, dimensions.height),
      bigStars: generateBoxShadows(200, dimensions.width, dimensions.height)
    };
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    function handleResize() {
      setDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate random positions for the nebulas to make them different on each load
  const nebulasStyle = useMemo(() => {
    return {
      nebula1: {
        top: `${Math.random() * 60 + 10}%`,
        left: `${Math.random() * 60 + 10}%`,
        animationDelay: `${Math.random() * 5}s`
      },
      nebula2: {
        top: `${Math.random() * 60 + 10}%`,
        left: `${Math.random() * 60 + 10}%`,
        animationDelay: `${Math.random() * 5}s`
      },
      nebula3: {
        top: `${Math.random() * 60 + 10}%`,
        left: `${Math.random() * 60 + 10}%`,
        animationDelay: `${Math.random() * 5}s`
      }
    };
  }, []);

  return (
    <div className="stars-background">
      {/* Basic star layers */}
      <div id="stars" style={{ boxShadow: smallStars }}></div>
      <div id="stars2" style={{ boxShadow: mediumStars }}></div>
      <div id="stars3" style={{ boxShadow: bigStars }}></div>
      
      {/* Colorful nebula effects */}
      <div className="nebula nebula-1" style={nebulasStyle.nebula1}></div>
      <div className="nebula nebula-2" style={nebulasStyle.nebula2}></div>
      <div className="nebula nebula-3" style={nebulasStyle.nebula3}></div>
      
      {/* Twinkling stars for added realism */}
      <div className="twinkle-star twinkle-1"></div>
      <div className="twinkle-star twinkle-2"></div>
      <div className="twinkle-star twinkle-3"></div>
      <div className="twinkle-star twinkle-4"></div>
      <div className="twinkle-star twinkle-5"></div>
      
      {/* Shooting stars */}
      <div className="shooting-star shooting-star-1"></div>
      <div className="shooting-star shooting-star-2"></div>
      
      {/* Game title */}
      <div id="title">
        <span>
          Proteus Nebule
          <br />
          Battle Card Game
        </span>
      </div>
    </div>
  );
};

export default StarBackground;
