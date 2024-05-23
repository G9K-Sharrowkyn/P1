import React from 'react';

const Popup = ({ imageUrl, closePopup }) => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: 20 }}>
                <img src={imageUrl} alt="Popup" />
                <button onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};


export default Popup;
