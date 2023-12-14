
const TODOLIST_INITIAL_STATE = {
    list: JSON.parse(localStorage.getItem('tasks')) || []
};

export default function todoList(state = TODOLIST_INITIAL_STATE, action){
    switch (action.type) {
        case 'TODOLIST.ADD_ITEM':
            const currentList = [...state.list, action.text];

            localStorage.setItem('tasks', JSON.stringify(currentList));

            return {
                ...state,
                list: currentList
            }; 

        case 'TODOLIST.REMOVE_ITEM_BY_INDEX':
            return {
                ...state,
                list: state.list.filter((_, idx) => idx !== action.index)
            };
        default:
            return state;
    }
}

