import {
    ADD_USER_FAILED,
    FETCH_ALL_USERS_FAILED,
    RECEIVED_ADDED_USER,
    RECEIVED_ALL_USERS,
    REQUEST_ADD_USER,
    REQUEST_ALL_USERS
} from "../actions/users";

function users(state = {
    isFetching: false,
    fetchFailed: false,
    isAdding: false,
    addingFailed: false,
    all: []
}, action) {
    switch (action.type) {
        case REQUEST_ALL_USERS:
            return {
                ...state,
                isFetching: true,
                fetchFailed: false
            };
        case RECEIVED_ALL_USERS:
            let allUsers = action.users.map(user => ({id: user.id, name: user.name}));
            return {
                ...state,
                all: allUsers,
                isFetching: false,
                fetchFailed: false
            };
        case FETCH_ALL_USERS_FAILED:
            return {
                ...state,
                isFetching: false,
                fetchFailed: true
            };
        case REQUEST_ADD_USER:
            return {
                ...state,
                isAdding: true,
                addingFailed: false
            };
        case RECEIVED_ADDED_USER:
            let newUsers = state.all.slice();
            newUsers.unshift(action.user);
            return {
                ...state,
                all: newUsers,
                isAdding: false,
                addingFailed: false
            };
        case ADD_USER_FAILED:
            return {
                ...state,
                isAdding: false,
                addingFailed: true,
                addingFailedMessage: action.error
            };
        default:
            return state
    }
}

export default users;
