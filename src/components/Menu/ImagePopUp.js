import React from 'react';
import ImagePopup from '../Pop-Up/ImagePopup';
import sampleImg from '../../assets/images/Corax.jpg';

const Discord = () => {
    return(
        <div className="page">
            <section>
                <h4>Discord</h4>
                <ImagePopup imageUrl={sampleImg} />
            </section>
        </div>
    )
}

export default Discord;
