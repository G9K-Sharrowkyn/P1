import React from 'react';
import ImagePopup from '../Pop-Up/ImagePopup';

const Discord = () => {
    return(
        <div className="page">
            <section>
                <h4>Discord</h4>
                <ImagePopup imageUrl={require('../../assets/images/Corax.jpg')} />
            </section>
        </div>
    )
}

export default Discord;
