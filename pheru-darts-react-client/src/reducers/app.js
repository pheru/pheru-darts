import {SET_NAVIGATION_BAR_VISIBILITY, TOGGLE_NAVIGATION_BAR_VISIBILITY} from "../actions/app";

function app(state = {
    navigationBarVisible: true
}, action) {
    switch (action.type) {
        case TOGGLE_NAVIGATION_BAR_VISIBILITY: {
            return {
                ...state,
                navigationBarVisible: !state.navigationBarVisible
            };
        }
        case SET_NAVIGATION_BAR_VISIBILITY: {
            return {
                ...state,
                navigationBarVisible: action.visibility
            };
        }
        default:
            return state
    }
}

export default app