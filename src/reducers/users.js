import {FETCH_ALL_USERS_FAILED, RECEIVED_ALL_USERS, REQUEST_ALL_USERS} from "../actions/users";

function users(state = {
    isFetching: false,
    fetchFailed: false,
    all: []
}, action) {
    switch (action.type) {
        case REQUEST_ALL_USERS:
            return {
                ...state,
                isFetching: true
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
            console.log("Failed" + action.error);
            return {
                ...state,
                isFetching: false,
                fetchFailed: true
            };
        default:
            return state
    }
}

export default users;
