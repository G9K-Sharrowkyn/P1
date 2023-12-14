import { combineReducers } from 'redux'
import todoList from "./todolist.reducer";
import counter from "./counter.reducer";


const rootReducer = combineReducers({
    todoList,
    counter
});

export default rootReducer;