import React, { useState, useEffect } from 'react';
import cardsSpecifics, { applyCardTraits } from './CardsSpecifics';
import GameMechanics, { Phases } from './GameMechanics';
import '../../assets/css/CardGame.css';

const GameInterface = ({ deck, setDeck }) => {
    const [graveyard, setGraveyard] = useState([]);
    const [hand, setHand] = useState([]);
    const [playerUnits, setPlayerUnits] = useState([]);
    const [playerCommands, setPlayerCommands] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [gameMechanics] = useState(new GameMechanics());
    const [currentPhase, setCurrentPhase] = useState(gameMechanics.getCurrentPhase());
    const [playerHP, setPlayerHP] = useState(100);
    const [shouldAnimateButton, setShouldAnimateButton] = useState(false);
    
    useEffect(() => {
        drawInitialHand();
    }, [deck]);

    const drawInitialHand = () => {
        if (deck.length > 0 && hand.length === 0) {
            let newHand = [];
            let newDeck = [...deck];

            let cardsToDraw = Math.min(7, newDeck.length);
            let drawnCards = 0;

            while (drawnCards < cardsToDraw) {
                let cardIndex = Math.floor(Math.random() * newDeck.length);
                let selectedCard = newDeck.splice(cardIndex, 1)[0];

                if (selectedCard && selectedCard.image) {
                    newHand.push(selectedCard);
                    drawnCards++;
                }
            }

            setHand(newHand);
            setDeck(newDeck);
        }
    };

    const handleEndPhase = () => {
        gameMechanics.endCurrentPhase();
        setCurrentPhase(gameMechanics.getCurrentPhase());
        setShouldAnimateButton(false);
    };

    const selectCard = (card) => {
        if (selectedCard === card) {
            setSelectedCard(null);
        } else {
            setSelectedCard(card);
        }
    };

    const deployCardToPlayerZone = (zone) => {
        if (!selectedCard || !gameMechanics.canPlayCardInZone(selectedCard.name, zone)) {
            console.error("Cannot play this card in the selected zone");
            return;
        }

        if (gameMechanics.getCurrentPhase() === Phases.COMMAND) {
            if (zone === "player-command") {
                if (playerCommands.length >= 1) {
                    console.error("Can only play one card in the Command Phase");
                    return;
                } else {
                    setPlayerCommands([...playerCommands, selectedCard]);
                    setShouldAnimateButton(true);
                }
            } else {
                console.error("Cannot play cards in the Battle Zone during the Command Phase");
                return;
            }
        } else if (gameMechanics.getCurrentPhase() === Phases.DEPLOYMENT) {
            if (zone === "player-command" && gameMechanics.getCurrentPhase() === Phases.COMMAND) {
                setPlayerCommands([...playerCommands, selectedCard]);
                setShouldAnimateButton(true);
            }
        } else if (gameMechanics.getCurrentPhase() === Phases.BATTLE) {
        }
    
        if (zone === "player-units") {
            setPlayerUnits([...playerUnits, selectedCard]);
        } else if (zone === "player-command") {
            setPlayerCommands([...playerCommands, selectedCard]);
        }
    
        setHand(hand.filter((item) => item !== selectedCard));
        setSelectedCard(null);
    };

    return (
        <div className="flex flex-col h-screen justify-between">
        <div className="zones-container flex-grow flex justify-center items-center">
    <button 
        className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded w-[300px]"
        disabled
                >
                Current Phase: {gameMechanics.getCurrentPhase()}
                </button>
                <button 
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${shouldAnimateButton ? 'animate-golden-line' : ''}`}
                    onClick={handleEndPhase}
                    >
                    {currentPhase === Phases.BATTLE ? 'End Turn' : 'End Phase'}
                </button>
                <button 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    disabled
                    >
                    HP: {playerHP}
                </button>
            </div>
            <div className="opponent-zones flex-grow">
                <div className="opponent-units bg-gray-100 p-4 m-2 rounded">
                </div>
                <div className="opponent-commands bg-gray-200 p-4 m-2 rounded">
                </div>
            </div>
            <div className="player-zones flex-grow">
                <div className="player-units bg-blue-100 p-4 m-2 rounded cursor-pointer min-h-[10rem]"
                     onClick={() => deployCardToPlayerZone("player-units")}>
                    {playerUnits.map((card, index) => (
                        <div key={index} className="inline-block mx-2" style={{ maxWidth: '10%' }}>
                            <img src={card.image} alt={card.name} className="w-full h-auto" />
                        </div>
                    ))}
                </div>
                <div className="player-commands bg-green-100 p-4 m-2 rounded cursor-pointer min-h-[10rem]"
                     onClick={() => deployCardToPlayerZone("player-command")}>
                    {playerCommands.map((card, index) => (
                        <div key={index} className="inline-block mx-2" style={{ maxWidth: '10%' }}>
                            <img src={card.image} alt={card.name} className="w-full h-auto" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="hand absolute bottom-0 flex justify-center items-end flex-wrap gap-4 mb-4 w-full">
                {hand.map((card, index) => (
                    <div key={index} 
                    className={`card bg-white shadow-lg rounded overflow-hidden ${selectedCard === card ? 'ring-2 ring-blue-500 animate-selected' : ''} cursor-pointer`}
                    style={{ maxWidth: '10%' }} 
                    onClick={() => selectCard(card)}>
                    {card.image && <img src={card.image} alt={card.name} className="w-full h-auto" />}
                    </div>
                ))}
            </div>
            <div className="deck-and-graveyard absolute bottom-0 w-full flex justify-between px-4">
                <div className="deck">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Deck ({deck.length})
                    </button>
                </div>
                <div className="graveyard">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Graveyard ({graveyard.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameInterface;
