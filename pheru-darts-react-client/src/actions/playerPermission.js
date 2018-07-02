import {getConfig} from "../services/configService";
import {fetchDelete, fetchGet, fetchPost} from "../services/fetchService";

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
export const fetchPermittedUsersSuccessful = (userIds) => ({
    type: FETCH_PERMITTED_USERS_SUCCESSFUL,
    userIds
});
export const fetchPermittedUsersFailed = (message) => ({
    type: FETCH_PERMITTED_USERS_FAILED,
    message
});
export const requestFetchPlayableUsers = () => ({
    type: REQUEST_FETCH_PLAYABLE_USERS
});
export const fetchPlayableUsersSuccessful = (userIds) => ({
    type: FETCH_PLAYABLE_USERS_SUCCESSFUL,
    userIds
});
export const fetchPlayableUsersFailed = (message) => ({
    type: FETCH_PLAYABLE_USERS_FAILED,
    message
});
export const requestUpdatePlayerPermission = () => ({
    type: REQUEST_UPDATE_PLAYER_PERMISSION
});
export const addPlayerPermissionSuccessful = (changedUserId) => ({
    type: ADD_PLAYER_PERMISSION_SUCCESSFUL,
    changedUserId
});
export const removePlayerPermissionSuccessful = (changedUserId) => ({
    type: REMOVE_PLAYER_PERMISSION_SUCCESSFUL,
    changedUserId
});
export const updatePlayerPermissionFailed = (message) => ({
    type: UPDATE_PLAYER_PERMISSION_FAILED,
    message
});

export function fetchPlayableUsers(currentUserId) {
    return function (dispatch) {
        dispatch(requestFetchPlayableUsers());
        return fetchGet(getConfig().resourceUrls.playerPermission + "/playable/" + currentUserId,
            json => dispatch(fetchPlayableUsersSuccessful(json)),
            responseNotOk => dispatch(fetchPlayableUsersFailed(responseNotOk.message)),
            error => dispatch(fetchPlayableUsersFailed(error))
        );
    };
}

export function fetchPermittedUsers(currentUserId) {
    return function (dispatch) {
        dispatch(requestFetchPermittedUsers());
        return fetchGet(getConfig().resourceUrls.playerPermission + "/permitted/" + currentUserId,
            json => dispatch(fetchPermittedUsersSuccessful(json)),
            responseNotOk => dispatch(fetchPermittedUsersFailed(responseNotOk.message)),
            error => dispatch(fetchPermittedUsersFailed(error))
        );
    };
}

export function addPlayerPermission(userIdToPermit) {
    return function (dispatch) {
        dispatch(requestUpdatePlayerPermission());
        return fetchPost(getConfig().resourceUrls.playerPermission,
            {permittedUserId: userIdToPermit},
            json => dispatch(addPlayerPermissionSuccessful(userIdToPermit)),
            responseNotOk => dispatch(updatePlayerPermissionFailed(responseNotOk.message)),
            error => dispatch(updatePlayerPermissionFailed(error))
        );
    };
}

export function removePlayerPermission(userIdToRemove) {
    return function (dispatch) {
        dispatch(requestUpdatePlayerPermission());
        return fetchDelete(getConfig().resourceUrls.playerPermission,
            {permittedUserId: userIdToRemove},
            json => dispatch(removePlayerPermissionSuccessful(userIdToRemove)),
            responseNotOk => dispatch(updatePlayerPermissionFailed(responseNotOk.message)),
            error => dispatch(updatePlayerPermissionFailed(error))
        );
    };
}