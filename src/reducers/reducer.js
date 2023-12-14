import { combineReducers } from 'redux';
import todoList from "./todolist.reducer";
import counter from "./counter.reducer";
import cards from "./cards.reducer";

const rootReducer = combineReducers({
    todoList,
    counter,
    cards
});

export default rootReducer;