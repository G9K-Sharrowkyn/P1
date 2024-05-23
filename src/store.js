import {createStore, applyMiddleware} from 'redux';
import {fromJS} from 'immutable';
import {routerMiddleware} from 'react-router-redux';
import rootReducer from './reducers/reducer.js'
import { thunk } from 'redux-thunk'

export default function configureStore(initialState = {}, history) {
    // Create the store with two middlewares
    // 1. sagaMiddleware: Makes redux-sagas work
    // 2. routerMiddleware: Syncs the location/URL path to the state
    const middlewares = [thunk, routerMiddleware(history)]; // loggerMiddleware

    const store = createStore(rootReducer, fromJS(initialState), applyMiddleware(...middlewares));

    return store;
}