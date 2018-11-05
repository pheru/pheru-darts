import {
    FETCH_SERVER_VERSION_FAILED,
    FETCH_SERVER_VERSION_SUCCESSFUL,
    REQUEST_SERVER_VERSION
} from "../actions/serverInformation";

function serverInformation(state = {
    version: "Lade...",
    isFetchingVersion: false
}, action) {
    switch (action.type) {
        case REQUEST_SERVER_VERSION:
            return {
                ...state,
                version: "Lade...",
                isFetchingVersion: true
            };
        case FETCH_SERVER_VERSION_SUCCESSFUL:
            return {
                ...state,
                version: action.version,
                isFetchingVersion: false
            };
        case FETCH_SERVER_VERSION_FAILED:
            return {
                ...state,
                version: "Unbekannt",
                isFetchingVersion: false
            };
        default:
            return state
    }
}

export default serverInformation