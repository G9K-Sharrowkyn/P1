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
        default:
            return state;
    }
}
