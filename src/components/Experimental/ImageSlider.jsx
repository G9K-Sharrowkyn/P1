import React from 'react';
import "./NewMenu.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

function ImageSlider() {
  return (
    <>
        <div id="image-track" data-mouse-down-at="0" data-prev-percentage="0">
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 1" />
        ))}
                {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 2"/>
        ))}
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 3" />
        ))}
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 4" />
        ))}
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 5" />
        ))}
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 6" />
        ))}
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 7" />
        ))}
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 8" />
        ))}
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 9" />
        ))}
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 10" />
        ))}
        {[
          'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWge',
        ].map((src, index) => (
          <img key={index} className="image" src={src} draggable="false" alt="Opis zdjęcia 11" />
        ))}
      </div>
      <a id="source-link" className="meta-link" href="https://camillemormal.com" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faLink} />
        <span>Source</span>
      </a>
      <a id="yt-link" className="meta-link" href="https://youtu.be/PkADl0HubMY" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faYoutube} />
        <span>7 min tutorial</span>
      </a>
    </>
  );
};

export default ImageSlider;
