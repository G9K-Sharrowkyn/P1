import React, { useEffect, useRef, useMemo } from 'react';
import './StarBackground.css';

/**
 * Draw and animate a simple star field on a canvas for better performance
 */
function useStarfield(canvasRef) {
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const starCount = Math.floor((canvas.width + canvas.height) / 10);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      alpha: Math.random() * 0.5 + 0.5
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);
}

const StarBackground = () => {
  const canvasRef = useRef(null);
  useStarfield(canvasRef);

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
      <canvas ref={canvasRef} className="stars-canvas" />
      
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
