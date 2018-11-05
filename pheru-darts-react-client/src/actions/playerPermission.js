import {getConfig} from "../services/configService";
import {fetchDelete, fetchGet, fetchPost} from "../services/fetchService";
import {showError} from "./errors";
import {defaultErrorHandling} from "../util/actionUtil";

export const REQUEST_FETCH_PERMITTED_USERS = 'REQUEST_FETCH_PERMITTED_USERS';
export const FETCH_PERMITTED_USERS_SUCCESSFUL = 'FETCH_PERMITTED_USERS_SUCCESSFUL';
export const FETCH_PERMITTED_USERS_FAILED = 'FETCH_PERMITTED_USERS_FAILED';

export const REQUEST_FETCH_PLAYABLE_USERS = 'REQUEST_FETCH_PLAYABLE_USERS';
export const FETCH_PLAYABLE_USERS_SUCCESSFUL = 'FETCH_PLAYABLE_USERS_SUCCESSFUL';
export const FETCH_PLAYABLE_USERS_FAILED = 'FETCH_PLAYABLE_USERS_FAILED';

export const REQUEST_UPDATE_PLAYER_PERMISSION = 'REQUEST_UPDATE_PLAYER_PERMISSION';
export const ADD_PLAYER_PERMISSION_SUCCESSFUL = 'ADD_PLAYER_PERMISSION_SUCCESSFUL';
export const REMOVE_PLAYER_PERMISSION_SUCCESSFUL = 'REMOVE_PLAYER_PERMISSION_SUCCESSFUL';
export const UPDATE_PLAYER_PERMISSION_FAILED = 'UPDATE_PLAYER_PERMISSION_FAILED';

export const requestFetchPermittedUsers = () => ({
    type: REQUEST_FETCH_PERMITTED_USERS
});
export const fetchPermittedUsersSuccessful = (users) => ({
    type: FETCH_PERMITTED_USERS_SUCCESSFUL,
    users
});
export const fetchPermittedUsersFailed = (message) => ({
    type: FETCH_PERMITTED_USERS_FAILED,
    message
});
export const requestFetchPlayableUsers = () => ({
    type: REQUEST_FETCH_PLAYABLE_USERS
});
export const fetchPlayableUsersSuccessful = (users) => ({
    type: FETCH_PLAYABLE_USERS_SUCCESSFUL,
    users
});
export const fetchPlayableUsersFailed = (message) => ({
    type: FETCH_PLAYABLE_USERS_FAILED,
    message
});
export const requestUpdatePlayerPermission = () => ({
    type: REQUEST_UPDATE_PLAYER_PERMISSION
});
export const addPlayerPermissionSuccessful = (changedUser) => ({
    type: ADD_PLAYER_PERMISSION_SUCCESSFUL,
    changedUser
});
export const removePlayerPermissionSuccessful = (changedUserId) => ({
    type: REMOVE_PLAYER_PERMISSION_SUCCESSFUL,
    changedUserId
});
export const updatePlayerPermissionFailed = (message) => ({
    type: UPDATE_PLAYER_PERMISSION_FAILED,
    message
});

export function fetchPlayableUsers() {
    return function (dispatch) {
        dispatch(requestFetchPlayableUsers());
        return fetchGet(getConfig().resourceUrls.playerPermission + "/playable",
            json => dispatch(fetchPlayableUsersSuccessful(json)),
            responseNotOk => {
                dispatch(fetchPlayableUsersFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Failed to fetch playable users", responseNotOk.message));
            },
            error => {
                dispatch(fetchPlayableUsersFailed(error.message));
                dispatch(showError("Failed to fetch playable users", error.message));
            }
        );
    };
}

export function fetchPermittedUsers() {
    return function (dispatch) {
        dispatch(requestFetchPermittedUsers());
        return fetchGet(getConfig().resourceUrls.playerPermission + "/permitted",
            json => dispatch(fetchPermittedUsersSuccessful(json)),
            responseNotOk => {
                dispatch(fetchPermittedUsersFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Failed to fetch permitted users", responseNotOk.message));
            },
            error => {
                dispatch(fetchPermittedUsersFailed(error.message));
                dispatch(showError("Failed to fetch permitted users", error.message));
            }
        );
    };
}

export function addPlayerPermissionById(userIdToPermit) {
    return function (dispatch) {
        dispatch(requestUpdatePlayerPermission());
        return fetchPost(getConfig().resourceUrls.playerPermission,
            {
                permittedId: userIdToPermit,
            },
            json => dispatch(addPlayerPermissionSuccessful(json)),
            responseNotOk => {
                dispatch(updatePlayerPermissionFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Failed to update permissions", responseNotOk.message));
            },
            error => {
                dispatch(updatePlayerPermissionFailed(error.message));
                dispatch(showError("Failed to update permissions", error.message));
            }
        );
    };
}

export function addPlayerPermissionByName(userNameToPermit) {
    return function (dispatch) {
        dispatch(requestUpdatePlayerPermission());
        return fetchPost(getConfig().resourceUrls.playerPermission,
            {
                permittedUsername: userNameToPermit,
            },
            json => dispatch(addPlayerPermissionSuccessful(json)),
            responseNotOk => {
                dispatch(updatePlayerPermissionFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Failed to update permissions", responseNotOk.message));
            },
            error => {
                dispatch(updatePlayerPermissionFailed(error.message));
                dispatch(showError("Failed to update permissions", error.message));
            }
        );
    };
}

export function removePlayerPermission(userIdToRemove) {
    return function (dispatch) {
        dispatch(requestUpdatePlayerPermission());
        return fetchDelete(getConfig().resourceUrls.playerPermission,
            {
                permittedId: userIdToRemove,
            },
            json => dispatch(removePlayerPermissionSuccessful(userIdToRemove)),
            responseNotOk => {
                dispatch(updatePlayerPermissionFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Failed to update permissions", responseNotOk.message));
            },
            error => {
                dispatch(updatePlayerPermissionFailed(error.message));
                dispatch(showError("Failed to update permissions", error.message));
            }
        );
    };
}