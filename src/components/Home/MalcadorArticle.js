import React from 'react';
import { Link } from 'react-router-dom';

import "../../assets/css/Chat.css"; 
import "../../assets/css/Home.css"; 

const MalcadorArticle = () => {
    return (
        <div>
        <div className='gobackhomebtn'>
                <Link to="/home" className="read-article-button">
                Wróć do strony domowej
                </Link>
        </div>
        <div className="malcadorarticle">
            <div className="button-container">
            </div>
                <div className="malcador-article-container">
                    <b className="b">Malcador the Sigillite, also known as Malcador the Hero by decree of the Emperor of Mankind, was the powerful psyker and scholar who served as the Imperial Regent when the Emperor was away from Terra or otherwise engaged and also as the first Grand Master of Assassins during the Great Crusade and the Horus Heresy eras.</b>
                    <c className="c">By the dawn of the 31st Millennium, Malcador was over 6,700 standard years old and could remember his date of birth to the second. His title of "Sigillite", meaning "seal-bearer" in an ancient Terran language, was a measure of the esteem and trust the Emperor had in Malcador, for he was empowered to speak and act in the Emperor's stead with the Emperor's full authority wherever he went.</c>
                    <d className="d">It was also a reference to the Sigillites, an ancient and highly secretive organisation which had sought to gather and preserve all the greatest cultural artefacts of Mankind from before the Age of Strife overwhelmed humanity's early interstellar civilisation during the Age of Technology. Malacador had been a member of the Sigillites, and was likely their last survivor.</d>
            </div>
            <div className="malcador-image">
            </div>
        </div>
        </div>
    );
}

export default MalcadorArticle;
