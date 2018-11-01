import {
    HIDE_LOGIN_MODAL,
    HIDE_SIGNUP_MODAL,
    LOGIN_BY_TOKEN_FAILED,
    LOGIN_BY_TOKEN_SUCCESSFUL,
    LOGIN_FAILED,
    LOGIN_SUCCESSFUL,
    LOGOUT_FAILED,
    LOGOUT_SUCCESSFUL,
    REQUEST_LOGIN,
    REQUEST_LOGIN_BY_TOKEN,
    REQUEST_LOGOUT, REQUEST_SIGNUP,
    SHOW_LOGIN_MODAL,
    SHOW_SIGNUP_MODAL, SIGNUP_FAILED, SIGNUP_SUCCESSFUL,
} from "../actions/user";

function user(state = {
    id: undefined,
    name: undefined,
    showLoginModal: false,
    showSignUpModal: false,
    isLoggedIn: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isSigningUp: false
}, action) {
    switch (action.type) {
        case SHOW_LOGIN_MODAL:
            return {
                ...state,
                showLoginModal: true
            };
        case HIDE_LOGIN_MODAL:
            return {
                ...state,
                showLoginModal: false
            };
        case SHOW_SIGNUP_MODAL:
            return {
                ...state,
                showSignUpModal: true
            };
        case HIDE_SIGNUP_MODAL:
            return {
                ...state,
                showSignUpModal: false
            };
        case REQUEST_LOGIN:
            return {
                ...state,
                isLoggingIn: true
            };
        case LOGIN_SUCCESSFUL:
            return {
                ...state,
                isLoggingIn: false,
                showLoginModal: false
            };
        case LOGIN_FAILED:
            return {
                ...state,
                isLoggingIn: false
            };
        case REQUEST_LOGIN_BY_TOKEN:
            return {
                ...state,
                name: undefined,
                isLoggedIn: false,
                isLoggingIn: true
            };
        case LOGIN_BY_TOKEN_SUCCESSFUL:
            return {
                ...state,
                id: action.userInfo.id,
                name: action.userInfo.name,
                isLoggedIn: true,
                isLoggingIn: false,
                showLoginModal: false
            };
        case LOGIN_BY_TOKEN_FAILED:
            return {
                ...state,
                id: undefined,
                name: undefined,
                isLoggedIn: false,
                isLoggingIn: false
            };
        case REQUEST_LOGOUT:
            return {
                ...state,
                isLoggingOut: true
            };
        case LOGOUT_SUCCESSFUL:
            return {
                ...state,
                id: undefined,
                name: undefined,
                isLoggedIn: false,
                isLoggingOut: false
            };
        case LOGOUT_FAILED:
            return {
                ...state,
                isLoggingOut: false
            };
        case REQUEST_SIGNUP:
            return {
                ...state,
                isSigningUp: true
            };
        case SIGNUP_SUCCESSFUL:
            return {
                ...state,
                isSigningUp: false,
                showSignUpModal: false
            };
        case SIGNUP_FAILED:
            return {
                ...state,
                isSigningUp: false
            };
        default:
            return state
    }
}

export default user;