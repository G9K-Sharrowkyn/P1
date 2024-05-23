const CARDS_INITIAL_STATE = {
    boosterPacks: 10,
    revealedCards: []
};

export default function cards(state = CARDS_INITIAL_STATE, action) {
    switch (action.type) {
        case 'CARDS.OPEN_BOOSTER':
            return {
                ...state,
                boosterPacks: state.boosterPacks > 0 ? state.boosterPacks - 1 : 0
            };
        case 'CARDS.ADD_BOOSTER_PACK':
            return {
                ...state,
                boosterPacks: state.boosterPacks + 1
            };
        case 'CARDS.REVEAL_CARDS':
            return {
                ...state,
                revealedCards: action.cards
            };
        default:
            return state;
    }
}
