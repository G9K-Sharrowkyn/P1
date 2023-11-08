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
      <button onClick={togglePlay}>
        {isPlaying ? 'Pauza' : 'Odtwórz'}
      </button>
    </div>
  );
}

export default AudioPlayer;