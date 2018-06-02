import {getConfig} from "../services/configService";

export const REQUEST_ALL_USERS = 'REQUEST_ALL_USERS';
export const RECEIVED_ALL_USERS = 'RECEIVED_ALL_USERS';
export const FETCH_ALL_USERS_FAILED = 'FETCH_ALL_USERS_FAILED';

export const requestAllUsers = () => ({
    type: REQUEST_ALL_USERS
});

export const receivedAllUsers = (users) => ({
    type: RECEIVED_ALL_USERS,
    users
});

export const fetchAllUsersFailed = (error) => ({
    type: FETCH_ALL_USERS_FAILED,
    error
});

export function fetchAllUsers() {
    return function (dispatch, getState) {
        dispatch(requestAllUsers());
        // return fetch(`https://www.reddit.com/r/${subreddit}.json`)
        return fetch(getConfig().urls.allUsers)
            .then(function (response) {
                if (!response.ok) {
                    dispatch(fetchAllUsersFailed("TODO"));
                }
                return response;
            })
            .then(
                response => response.json(),
                error => dispatch(fetchAllUsersFailed(error))
            )
            .then(json => {
                    if (!getState().users.fetchFailed) {
                        dispatch(receivedAllUsers(json))
                    }
                }
            )
    }
}