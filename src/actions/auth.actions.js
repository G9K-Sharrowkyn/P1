import axios from 'axios';

export const login = (username, password) => async dispatch => {
    try {
        const { data } = await axios.post('/api/login', { username, password }, { withCredentials: true });
        dispatch({ type: 'AUTH.LOGIN_SUCCESS', user: data });
    } catch (err) {
        console.error(err);
    }
};

export const register = (username, password) => async dispatch => {
    try {
        const { data } = await axios.post('/api/register', { username, password }, { withCredentials: true });
        dispatch({ type: 'AUTH.LOGIN_SUCCESS', user: data });
    } catch (err) {
        console.error(err);
    }
};

export const logout = () => async dispatch => {
    try {
        await axios.post('/api/logout', {}, { withCredentials: true });
    } catch (err) {
        console.error(err);
    }
    dispatch({ type: 'AUTH.LOGOUT' });
};
export const addCardsToCollection = (cards) => async dispatch => {
    try {
        const { data } = await axios.post('/api/collection', { cards }, { withCredentials: true });
        dispatch({ type: 'AUTH.UPDATE_COLLECTION', collection: data.collection });
    } catch (err) {
        console.error(err);
    }
};

export const addPoints = (points) => async dispatch => {
    try {
        const { data } = await axios.post('/api/points', { points }, { withCredentials: true });
        dispatch({ type: 'AUTH.ADD_POINTS', points: data.points });
    } catch (err) {
        console.error(err);
    }
};
