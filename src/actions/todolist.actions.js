// import { dispatch } from 'redux';

export const addItem = (item) => dispatch => {
    dispatch({ type: 'TODOLIST.ADD_ITEM', text: item });
}

export const removeItemByIndex = (index) => dispatch => {

    dispatch({ type: 'TODOLIST.REMOVE_ITEM_BY_INDEX', index });
}
