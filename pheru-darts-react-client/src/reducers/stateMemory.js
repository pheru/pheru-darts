import {MEMORIZE_STATE} from "../actions/stateMemory";

function stateMemory(state = {
    states: {}
}, action) {
    switch (action.type) {
        case MEMORIZE_STATE:
            let newStates = {...state.states};
            newStates[action.key] = action.state;
            return {
                ...state,
                states: newStates
            };
        default:
            return state
    }
}

export default stateMemory
