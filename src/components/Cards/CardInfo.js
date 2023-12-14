import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import ParticleCanvas from './BoosterAnimation';

import '../../assets/css/BoosterPack.css';

import Arcann from '../../assets/cards/Arcann.png'
import Caedus from '../../assets/cards/Caedus.png'
import Jacen from '../../assets/cards/Jacen.png'
import Krayt from '../../assets/cards/Krayt.png'
import Luke from '../../assets/cards/Luke.png'
import Plagueis from '../../assets/cards/Plagueis.png'
import Revan from '../../assets/cards/Revan.png'
import Sidious from '../../assets/cards/Sidious.png'
import Vader from '../../assets/cards/Vader.png'
import Vaylin from '../../assets/cards/Vaylin.png'
import Windu from '../../assets/cards/Windu.png'
import Yoda from  '../../assets/cards/Yoda.png'

import BoosterPack from '../../assets/cards/BoosterPack.png'

const CardInfo = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [boosterPacks, setBoosterPacks] = useState(10);
    const [showBoosterPack, setShowBoosterPack] = useState(false);
    const [revealedCards, setRevealedCards] = useState([]);
    const [particlesVisible, setParticlesVisible] = useState(false);
    const particleCanvasRef = useRef(null);

    const cards = [
        { name: 'Arcann', image: Arcann },
        { name: 'Caedus', image: Caedus },
        { name: 'Jacen', image: Jacen },
        { name: 'Krayt', image: Krayt },
        { name: 'Luke', image: Luke },
        { name: 'Plagueis', image: Plagueis },
        { name: 'Revan', image: Revan },
        { name: 'Sidious', image: Sidious },
        { name: 'Vader', image: Vader },
        { name: 'Vaylin', image: Vaylin },
        { name: 'Windu', image: Windu },
        { name: 'Yoda', image: Yoda },
    ];

    const openBooster = () => {
        if (boosterPacks > 0) {
            setShowBoosterPack(true);
            setRevealedCards([]);
        }
    };

    const handleBoosterPackClick = (event) => {
        setBoosterPacks(boosterPacks - 1);
        setIsAnimating(true);

        if (particleCanvasRef.current) {
            particleCanvasRef.current.triggerExplosion(event.clientX, event.clientY);
            setParticlesVisible(true);
            setTimeout(() => {
                setParticlesVisible(false);
            }, 1000);
        }

        let randomCards = [];
        for (let i = 0; i < 5; i++) {
            randomCards.push(cards[Math.floor(Math.random() * cards.length)]);
        }
        
        setTimeout(() => {
            setRevealedCards(randomCards);
            setShowBoosterPack(false);
            setIsAnimating(false);
        }, 1000);
    };

    const addBoosterPack = () => {
        setBoosterPacks(boosterPacks + 1);
    };

    return (
        <div>
            <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={openBooster}>
                Open Booster ({boosterPacks})
            </button>
            <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={addBoosterPack}>
                Add Booster
            </button>

            {showBoosterPack && (
                <div className="booster-pack flex justify-center items-center">
                    <img 
                      src={BoosterPack} 
                      alt="Booster Pack" 
                      className={`w-64 h-auto cursor-pointer ${isAnimating ? 'animate-spinAndShrink' : ''}`} 
                      onClick={handleBoosterPackClick} 
                    />
                    {particlesVisible && <ParticleCanvas ref={particleCanvasRef} />}
                </div>
            )}

            <div className="revealed-cards flex justify-center flex-wrap gap-4 mt-4">
            {revealedCards.map((card, index) => (
                <div key={index} className="card bg-white shadow-lg rounded overflow-hidden">
                <img src={card.image} alt={card.name} className="w-48 h-100" />
                </div>
            ))}
            </div>
        </div>
    );
};

export default connect(state => ({
    boosterPacks: state.cards.boosterPacks,
    revealedCards: state.cards.revealedCards
}))(CardInfo);
