import {getConfig} from "../services/configService";
import {fetchGet, fetchPost} from "../services/fetchService";

export const REQUEST_ALL_USERS = 'REQUEST_ALL_USERS';
export const RECEIVED_ALL_USERS = 'RECEIVED_ALL_USERS';
export const FETCH_ALL_USERS_FAILED = 'FETCH_ALL_USERS_FAILED';
export const REQUEST_ADD_USER = 'REQUEST_ADD_USER';
export const RECEIVED_ADDED_USER = 'RECEIVED_ADDED_USER';
export const ADD_USER_FAILED = 'ADD_USER_FAILED';

export const requestAllUsers = () => ({
    type: REQUEST_ALL_USERS
});

export const receivedAllUsers = (users) => ({
    type: RECEIVED_ALL_USERS,
    users
});

export const fetchAllUsersFailed = () => ({
    type: FETCH_ALL_USERS_FAILED
});

export const requestAddUser = () => ({
    type: REQUEST_ADD_USER
});

export const receivedAddedUser = (user) => ({
    type: RECEIVED_ADDED_USER,
    user
});

export const addUserFailed = (error) => ({
    type: ADD_USER_FAILED,
    error
});

export function fetchAllUsers() {
    return function (dispatch) {
        dispatch(requestAllUsers());
        return fetchGet(getConfig().resourceUrls.users,
            json => dispatch(receivedAllUsers(json)),
            responseNotOk => dispatch(fetchAllUsersFailed()),
            error => dispatch(fetchAllUsersFailed())
        );
    };
}

export function addUser(user) {
    return function (dispatch) {
        dispatch(requestAddUser());
        return fetchPost(getConfig().resourceUrls.users,
            user,
            json => dispatch(receivedAddedUser(json)),
            responseNotOk => dispatch(addUserFailed(responseNotOk.message)),
            error => dispatch(addUserFailed("Network Error"))
        );
    };
}