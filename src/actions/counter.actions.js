// import { dispatch } from 'redux';

export const incrementCounter = (value) => dispatch => {
    dispatch({ type: 'COUNTER.INCREMENT_VALUE', value });
}
