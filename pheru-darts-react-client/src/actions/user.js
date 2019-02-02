import {fetchDelete, fetchGet, fetchPost, fetchPut} from "../services/fetchService";
import {getConfig} from "../services/configService";
import {fetchPermittedUsers, fetchPlayableUsers} from "./playerPermission";
import {showError} from "./modal";
import {defaultErrorHandling} from "../util/actionUtil";
import {fetchNotifications} from "./notifications";

export const SHOW_LOGIN_MODAL = "SHOW_LOGIN_MODAL";
export const HIDE_LOGIN_MODAL = "HIDE_LOGIN_MODAL";
export const SHOW_SIGNUP_MODAL = "SHOW_SIGNUP_MODAL";
export const HIDE_SIGNUP_MODAL = "HIDE_SIGNUP_MODAL";

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const REQUEST_LOGIN_BY_TOKEN = 'REQUEST_LOGIN_BY_TOKEN';
export const LOGIN_BY_TOKEN_SUCCESSFUL = 'LOGIN_BY_TOKEN_SUCCESSFUL';
export const LOGIN_BY_TOKEN_FAILED = 'LOGIN_BY_TOKEN_FAILED';

export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const LOGOUT_SUCCESSFUL = 'LOGOUT_SUCCESSFUL';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';

export const REQUEST_SIGNUP = 'REQUEST_SIGNUP';
export const SIGNUP_SUCCESSFUL = 'SIGNUP_SUCCESSFUL';
export const SIGNUP_FAILED = 'SIGNUP_FAILED';

export const REQUEST_MODIFY_USER = 'REQUEST_MODIFY_USER';
export const MODIFY_USER_SUCCESSFUL = 'MODIFY_USER_SUCCESSFUL';
export const MODIFY_USER_FAILED = 'MODIFY_USER_FAILED';

export const REQUEST_DELETE_USER = 'REQUEST_DELETE_USER';
export const DELETE_USER_SUCCESSFUL = 'DELETE_USER_SUCCESSFUL';
export const DELETE_USER_FAILED = 'DELETE_USER_FAILED';

export const showLoginModal = () => ({
    type: SHOW_LOGIN_MODAL
});
export const hideLoginModal = () => ({
    type: HIDE_LOGIN_MODAL
});
export const showSignUpModal = () => ({
    type: SHOW_SIGNUP_MODAL
});
export const hideSignUpModal = () => ({
    type: HIDE_SIGNUP_MODAL
});
export const requestLogin = () => ({
    type: REQUEST_LOGIN
});
export const loginSuccessful = () => ({
    type: LOGIN_SUCCESSFUL
});
export const loginFailed = (message) => ({
    type: LOGIN_FAILED,
    message
});
export const requestLoginByToken = () => ({
    type: REQUEST_LOGIN_BY_TOKEN
});
export const loginByTokenSuccessful = (userInfo) => ({
    type: LOGIN_BY_TOKEN_SUCCESSFUL,
    userInfo
});
export const loginByTokenFailed = () => ({
    type: LOGIN_BY_TOKEN_FAILED
});
export const requestLogout = () => ({
    type: REQUEST_LOGOUT
});
export const logoutSuccessful = () => ({
    type: LOGOUT_SUCCESSFUL
});
export const logoutFailed = () => ({
    type: LOGOUT_FAILED
});
export const requestSignUp = () => ({
    type: REQUEST_SIGNUP
});
export const signUpSuccessful = () => ({
    type: SIGNUP_SUCCESSFUL
});
export const signUpFailed = (message) => ({
    type: SIGNUP_FAILED,
    message
});
export const requestModifyUser = () => ({
    type: REQUEST_MODIFY_USER
});
export const modifyUserSuccessful = () => ({
    type: MODIFY_USER_SUCCESSFUL
});
export const modifyUserFailed = (message) => ({
    type: MODIFY_USER_FAILED,
    message
});
export const requestDeleteUser = () => ({
    type: REQUEST_DELETE_USER
});
export const deleteUserSuccessful = () => ({
    type: DELETE_USER_SUCCESSFUL
});
export const deleteUserFailed = (message) => ({
    type: DELETE_USER_FAILED,
    message
});

export function signUp(name, password) {
    return function (dispatch) {
        dispatch(requestSignUp());
        return fetchPost(getConfig().resourceUrls.user,
            {name, password},
            json => {
                dispatch(signUpSuccessful());
                dispatch(login(name, password));
            },
            responseNotOk => {
                dispatch(signUpFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Sign-up failed", responseNotOk.message));
            },
            error => {
                dispatch(signUpFailed(error.message));
                dispatch(showError("Sign-up failed", error.message));
            }
        );
    };
}

export function login(name, password) {
    return function (dispatch) {
        dispatch(requestLogin());
        return fetchPost(getConfig().loginUrl,
            {name, password},
            json => {
                dispatch(loginSuccessful());
                dispatch(loginByToken(true));
            },
            responseNotOk => {
                dispatch(loginFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Login failed", responseNotOk.message));
            },
            error => {
                dispatch(loginFailed(error.message));
                dispatch(showError("Login failed", error.message));
            }
        );
    };
}

export function loginByToken(showErrorOnFailure) {
    return function (dispatch) {
        dispatch(requestLoginByToken());
        return fetchGet(getConfig().resourceUrls.user,
            json => {
                dispatch(loginByTokenSuccessful(json));
                dispatch(fetchPlayableUsers());
                dispatch(fetchPermittedUsers());
                dispatch(fetchNotifications());
            },
            responseNotOk => {
                dispatch(loginByTokenFailed());
                if (showErrorOnFailure) {
                    defaultErrorHandling(dispatch, responseNotOk, showError("Login by token failed", responseNotOk.message));
                }
            },
            error => {
                dispatch(loginByTokenFailed());
                dispatch(showError("Login by token failed", error.message));
            }
        );
    };
}

export function logout() {
    return function (dispatch) {
        dispatch(requestLogout());
        return fetchGet(getConfig().logoutUrl,
            json => dispatch(logoutSuccessful()),
            responseNotOk => {
                dispatch(logoutFailed());
                defaultErrorHandling(dispatch, responseNotOk, showError("Logout failed", responseNotOk.message));
            },
            error => {
                dispatch(logoutFailed());
                dispatch(showError("Logout failed", error.message));
            }
        );
    };
}

export function modifyUser(currentPassword, newName, newPassword) {
    return function (dispatch) {
        dispatch(requestModifyUser());
        return fetchPut(getConfig().resourceUrls.user,
            {currentPassword, newName, newPassword},
            json => {
                dispatch(modifyUserSuccessful());
                dispatch(loginByToken(true));
            },
            responseNotOk => {
                dispatch(modifyUserFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Modify user failed", responseNotOk.message));
            },
            error => {
                dispatch(modifyUserFailed(error.message));
                dispatch(showError("Modify user failed", error.message));
            }
        );
    };
}

export function deleteUser(currentPassword) {
    return function (dispatch) {
        dispatch(requestDeleteUser());
        return fetchDelete(getConfig().resourceUrls.user,
            {currentPassword},
            json => {
                dispatch(deleteUserSuccessful());
                dispatch(logout());
            },
            responseNotOk => {
                dispatch(deleteUserFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Delete user failed", responseNotOk.message));
            },
            error => {
                dispatch(deleteUserFailed(error.message));
                dispatch(showError("Delete user failed", error.message));
            }
        );
    };
}