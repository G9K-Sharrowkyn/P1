import React, { useState, useEffect, useRef } from 'react';
import "../../assets/css/General.css";
import Vivaldi from "../../assets/music/Vivaldi.mp3"; 

function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
      <div>
        <audio ref={audioRef} src={Vivaldi} preload="auto" />
        <button 
          onClick={togglePlay} 
          className="w-44 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
  );
}

export default AudioPlayer;