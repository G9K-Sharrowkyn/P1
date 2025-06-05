import { combineReducers } from 'redux';
import todoList from "./todolist.reducer";
import counter from "./counter.reducer";
import cards from "./cards.reducer";
import auth from "./auth.reducer";

const rootReducer = combineReducers({
    todoList,
    counter,
    cards,
    auth
});

export default rootReducer;