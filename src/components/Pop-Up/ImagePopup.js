import React, { useState } from 'react';
import Popup from './PopUp';

const ImagePopup = ({ imageUrl }) => {
    const [showPopup, setShowPopup] = useState(false);

    const openPopup = () => {
        new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageUrl;
        })
        .then(() => setShowPopup(true))
        .catch(error => console.error(error));
    };

    return (
        <div>
            <button onClick={openPopup}>Show Image</button>
            {showPopup && <Popup imageUrl={imageUrl} closePopup={() => setShowPopup(false)} />}
        </div>
    );
};

export default ImagePopup;
