import {HIDE_CURRENT_ERROR, SHOW_ERROR} from "../actions/errors";

function errors(state = {
    show: false,
    errors: []
}, action) {
    switch (action.type) {
        case SHOW_ERROR: {
            return pushError(state, action.title, action.message);
        }
        case HIDE_CURRENT_ERROR: {
            let newErrors = state.errors.slice();
            newErrors.shift();
            return {
                ...state,
                errors: newErrors,
                show: newErrors.length > 0
            };
        }
        default:
            return state
    }
}

function pushError(state, title, text) {
    let newErrors = state.errors.slice();
    newErrors.push({
        title,
        text
    });
    return {
        ...state,
        errors: newErrors,
        show: true
    };
}

export default errors