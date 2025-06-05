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
