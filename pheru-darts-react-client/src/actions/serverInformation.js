import FetchUtil from "../util/FetchUtil";
import ConfigUtil from "../util/ConfigUtil";
import {showError} from "./modal";
import ActionUtil from "../util/ActionUtil";

export const REQUEST_SERVER_VERSION = 'REQUEST_SERVER_VERSION';
export const FETCH_SERVER_VERSION_SUCCESSFUL = 'FETCH_SERVER_VERSION_SUCCESSFUL';
export const FETCH_SERVER_VERSION_FAILED = 'FETCH_SERVER_VERSION_FAILED';

export const requestServerVersion = () => ({
    type: REQUEST_SERVER_VERSION
});
export const fetchServerVersionSuccessful = (version) => ({
    type: FETCH_SERVER_VERSION_SUCCESSFUL,
    version
});
export const fetchServerVersionFailed = (message) => ({
    type: FETCH_SERVER_VERSION_FAILED,
    message
});

export function fetchServerVersion() {
    return function (dispatch) {
        dispatch(requestServerVersion());
        return FetchUtil.fetchGet(ConfigUtil.getConfig().resourceUrls.serverInformation,
            json => dispatch(fetchServerVersionSuccessful(json)),
            responseNotOk => {
                dispatch(fetchServerVersionFailed(responseNotOk.message));
                ActionUtil.defaultErrorHandling(dispatch, responseNotOk, showError("Could not fetch server version", responseNotOk.message));
            },
            error => {
                dispatch(fetchServerVersionFailed(error.message));
                dispatch(showError("Could not fetch server version", error.message));
            }
        );
    };
}



