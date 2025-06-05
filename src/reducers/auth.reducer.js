const AUTH_INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || null,
};

export default function auth(state = AUTH_INITIAL_STATE, action) {
    switch (action.type) {
        case 'AUTH.LOGIN_SUCCESS':
            localStorage.setItem('user', JSON.stringify(action.user));
            return { ...state, user: action.user };
        case 'AUTH.LOGOUT':
            localStorage.removeItem('user');
            return { ...state, user: null };
        case 'AUTH.UPDATE_COLLECTION':
            if (!state.user) return state;
            const updatedCollectionUser = { ...state.user, collection: action.collection };
            localStorage.setItem('user', JSON.stringify(updatedCollectionUser));
            return { ...state, user: updatedCollectionUser };
        case 'AUTH.ADD_POINTS':
            if (!state.user) return state;
            const updatedPointsUser = { ...state.user, points: action.points };
            localStorage.setItem('user', JSON.stringify(updatedPointsUser));
            return { ...state, user: updatedPointsUser };
        default:
            return state;
    }
}
