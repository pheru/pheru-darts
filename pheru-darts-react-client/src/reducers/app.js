import {
    SET_LANDSCAPE_ORIENTATION,
    SET_NAVIGATION_BAR_VISIBILITY,
    TOGGLE_NAVIGATION_BAR_VISIBILITY
} from "../actions/app";

function app(state = {
    navigationBarVisible: true,
    landscapeOrientation: true
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
        case SET_LANDSCAPE_ORIENTATION: {
            return {
                ...state,
                landscapeOrientation: action.landscapeOrientation
            };
        }
        default:
            return state
    }
}

export default app