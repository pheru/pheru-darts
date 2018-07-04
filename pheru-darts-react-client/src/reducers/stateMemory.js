import {MEMORIZE_NEW_GAME_CONFIG_STATE} from "../actions/stateMemory";

function stateMemory(state = {
    newGameConfigState: undefined
}, action) {
    switch (action.type) {
        case MEMORIZE_NEW_GAME_CONFIG_STATE:
            return {
                ...state,
                newGameConfigState: action.state
            };
        default:
            return state
    }
}

export default stateMemory
