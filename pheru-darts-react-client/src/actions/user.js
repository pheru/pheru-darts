import {fetchGet, fetchPost} from "../services/fetchService";
import {getConfig} from "../services/configService";

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

export function signUp(name, password) {
    return function (dispatch) {
        dispatch(requestSignUp());
        return fetchPost(getConfig().signUpUrl,
            {name, password},
            json => {
                dispatch(signUpSuccessful());
                dispatch(login(name, password));
            },
            responseNotOk => dispatch(signUpFailed(responseNotOk.message)),
            error => dispatch(signUpFailed())
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
                dispatch(loginByToken());
            },
            responseNotOk => dispatch(loginFailed(responseNotOk.message)),
            error => dispatch(loginFailed())
        );
    };
}

export function loginByToken() {
    return function (dispatch) {
        dispatch(requestLoginByToken());
        return fetchGet(getConfig().resourceUrls.users + "/current",
            json => dispatch(loginByTokenSuccessful(json)),
            responseNotOk => dispatch(loginByTokenFailed()),
            error => dispatch(loginByTokenFailed())
        );
    };
}

export function logout() {
    return function (dispatch) {
        dispatch(requestLogout());
        return fetchGet(getConfig().logoutUrl,
            json => dispatch(logoutSuccessful()),
            responseNotOk => dispatch(logoutFailed()),
            error => dispatch(logoutFailed())
        );
    };
}