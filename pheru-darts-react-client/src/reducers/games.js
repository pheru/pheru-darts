import {ARCHIVE_GAME_FAILED, ARCHIVE_GAME_SUCCESSFUL, REQUEST_ARCHIVE_GAME} from "../actions/games";

function games(state = {
    isArchiving: false
}, action) {
    switch (action.type) {
        case REQUEST_ARCHIVE_GAME:
            return {
                ...state,
                isArchiving: true
            };
        case ARCHIVE_GAME_SUCCESSFUL:
            console.log("Archive successful");
            return {
                ...state,
                isArchiving: false
            };
        case ARCHIVE_GAME_FAILED:
            console.log("Archive failed");
            return {
                ...state,
                isArchiving: false
            };
        default:
            return state
    }
}

export default games
