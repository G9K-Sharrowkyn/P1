
const COUNTER_INITIAL_STATE = {
    value: 0
};

export default function counter(state = COUNTER_INITIAL_STATE, action){
    switch (action.type) {
        case 'COUNTER.INCREMENT_VALUE':
            return {
                ...state,
                value: state.value + action.value
            }
        default:
            return state;
    }
}

