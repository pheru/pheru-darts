import {HIDE_CURRENT_MODAL, SHOW_MODAL} from "../actions/modal";

function modal(state = {
    show: false,
    items: []
}, action) {
    switch (action.type) {
        case SHOW_MODAL: {
            let newItems = state.items.slice();
            newItems.push({
                modalType: action.modalType,
                title: action.title,
                message: action.message
            });
            return {
                ...state,
                items: newItems,
                show: true
            };
        }
        case HIDE_CURRENT_MODAL: {
            let newItems = state.items.slice();
            newItems.shift();
            return {
                ...state,
                items: newItems,
                show: newItems.length > 0
            };
        }
        default:
            return state
    }
}

export default modal