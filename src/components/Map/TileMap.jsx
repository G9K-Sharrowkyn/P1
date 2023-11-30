import React from 'react';
import styles from './TileMap.css'; 

const TileMap = () => {
  return (
    <div className={styles.frame}>
      <div className={styles.camera}>
        <div className={`${styles.map} ${styles.pixelArt}`}>
          <div className={`${styles.character}`} data-facing="down" data-walking="true">
            <div className={`${styles.shadow} ${styles.pixelArt}`}></div>
            <div className={`${styles.characterSpritesheet} ${styles.pixelArt}`}></div>
          </div>
        </div>
    </div>
    </div>
  );
};

export default TileMap;