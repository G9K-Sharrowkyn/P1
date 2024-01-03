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
    const [commandPoints, setCommandPoints] = useState(0);
    const [hasPlayedCommandCard, setHasPlayedCommandCard] = useState(false);
    const [hasDrawnCard, setHasDrawnCard] = useState(false);
    const [shouldAnimateDeckButton, setShouldAnimateDeckButton] = useState(false);
    
    useEffect(() => {
        drawInitialHand();
    }, [deck]);

    useEffect(() => {
        if (currentPhase === Phases.COMMAND) {
            setHasPlayedCommandCard(false);
        }
    }, [currentPhase]);

    useEffect(() => {
        if (currentPhase === Phases.COMMAND && !hasDrawnCard) {
            setShouldAnimateDeckButton(true);
        } else {
            setShouldAnimateDeckButton(false);
        }
    }, [currentPhase, hasDrawnCard]);

    useEffect(() => {
        if (currentPhase === Phases.COMMAND) {
            setHasDrawnCard(false);
            setHasPlayedCommandCard(false);
        }
    }, [currentPhase]);

    useEffect(() => {
        if (currentPhase === Phases.COMMAND) {
            setHasPlayedCommandCard(false);
            setHasDrawnCard(false);
            setCommandPoints(calculateTotalCommandPoints());
        }
    }, [currentPhase, playerCommands]);

    const calculateTotalCommandPoints = () => {
        return playerCommands.reduce((total, card) => {
            const cardDetails = cardsSpecifics.find(c => c.name === card.name);
            return total + (cardDetails.type.includes("Shipyard") ? 2 : 1);
        }, 0);
    };

    const drawCardFromDeck = () => {
        if (currentPhase !== Phases.COMMAND || hasDrawnCard || deck.length === 0) {
            console.error("Cannot draw a card now");
            return;
        }
    
        let newDeck = [...deck];
        let drawnCard = newDeck.shift();
        setDeck(newDeck);
        setHand([...hand, drawnCard]);
        setHasDrawnCard(true);
    };

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
        if (gameMechanics.getCurrentPhase() === Phases.BATTLE) {
            console.error("No card selection is allowed during the Battle Phase");
            return;
        }
    
        if (gameMechanics.getCurrentPhase() === Phases.BATTLE) {
            console.error("No card selection is allowed during the Battle Phase");
            return;
        }
    
        if (gameMechanics.getCurrentPhase() === Phases.END_TURN) {
            console.error("No card selection is allowed during the End Turn Phase");
            return;
        }

        if (selectedCard === card) {
            setSelectedCard(null);
        } else {
            setSelectedCard(card);
        }
    };

    const deployCardToPlayerZone = (zone) => {

        if (!selectedCard) {
            console.error("No card selected");
            return;
        }
        
        const cardDetails = cardsSpecifics.find(card => card.name === selectedCard.name);
    if (!cardDetails) {
        console.error("Card details not found");
        return;
    }

        if (!selectedCard || !gameMechanics.canPlayCardInZone(selectedCard.name, zone)) {
            console.error("Cannot play this card in the selected zone");
            return;
        }

        if (gameMechanics.getCurrentPhase() === Phases.BATTLE) {
            console.error("No card deployment is allowed during the Battle Phase");
            return;
        }
    
        if (!selectedCard || !gameMechanics.canPlayCardInZone(selectedCard.name, zone)) {
            console.error("Cannot play this card in the selected zone");
            return;
        }
    
        if (gameMechanics.getCurrentPhase() === Phases.DEPLOYMENT) {
            if (zone === "player-unit-zone") {
                if (cardDetails.commandCost > commandPoints) {
                    console.error("Not enough command points to play this card");
                    return;
                }
                setPlayerUnits([...playerUnits, selectedCard]);
                setCommandPoints(current => Math.max(0, current - cardDetails.commandCost));
                setHand(hand.filter(item => item !== selectedCard));
            } else {
                console.error("In the Deployment phase, you can only play cards to the unit zone");
            }
            return;
        }

        if (gameMechanics.getCurrentPhase() === Phases.END_TURN) {
            console.error("No card deployment is allowed during the End Turn Phase");
            return;
        }
    
        if (!selectedCard || !gameMechanics.canPlayCardInZone(selectedCard.name, zone)) {
            console.error("Cannot play this card in the selected zone");
            return;
        }
    
        if (gameMechanics.getCurrentPhase() === Phases.COMMAND) {
            if (zone !== "player-command-zone") {
                console.error("During the Command Phase, cards can only be played in the command zone");
                return;
            }
    
            if (hasPlayedCommandCard) {
                console.error("Can only play one card in the Command Phase");
                return;
            }
    
            let pointsToAdd = cardDetails.type.includes("Shipyard") ? 2 : 1;
            setPlayerCommands([...playerCommands, selectedCard]);
            setCommandPoints(current => current + pointsToAdd);
            setShouldAnimateButton(true);
            setHasPlayedCommandCard(true);
            setHand(hand.filter(item => item !== selectedCard));
            return;
        }
        
        setHand(hand.filter(item => item !== selectedCard));
        setSelectedCard(null);

        if (zone === "player-unit-zone") {
            setPlayerUnits([...playerUnits, selectedCard]);
        } else if (zone === "player-command-zone") {
            setPlayerCommands([...playerCommands, selectedCard]);
        }
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
                <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Command Points: {commandPoints}
                </button>
            </div>
            <div className="opponent-zones flex-grow">
                <div className="opponent-units bg-gray-100 p-4 m-2 rounded">
                </div>
                <div className="opponent-commands bg-gray-200 p-4 m-2 rounded">
                </div>
            </div>
            <div className="player-zones flex-grow">
                <div className="player-unit-zone bg-blue-100 p-4 m-2 rounded cursor-pointer min-h-[10rem]"
                     onClick={() => deployCardToPlayerZone("player-unit-zone")}>
                    {playerUnits.map((card, index) => (
                        <div key={index} className="inline-block mx-2" style={{ maxWidth: '10%' }}>
                            <img src={card.image} alt={card.name} className="w-full h-auto" />
                        </div>
                    ))}
                </div>
                <div className="player-command-zone bg-green-100 p-4 m-2 rounded cursor-pointer min-h-[10rem]"
                     onClick={() => deployCardToPlayerZone("player-command-zone")}>
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
                    <button 
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${shouldAnimateDeckButton ? 'animate-golden-line' : ''}`}
                    onClick={drawCardFromDeck}
                    >
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
