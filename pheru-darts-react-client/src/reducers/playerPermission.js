import {
    ADD_PLAYER_PERMISSION_SUCCESSFUL,
    FETCH_PERMITTED_USERS_FAILED,
    FETCH_PERMITTED_USERS_SUCCESSFUL,
    FETCH_PLAYABLE_USERS_FAILED,
    FETCH_PLAYABLE_USERS_SUCCESSFUL,
    REMOVE_PLAYER_PERMISSION_SUCCESSFUL,
    REQUEST_FETCH_PERMITTED_USERS,
    REQUEST_FETCH_PLAYABLE_USERS,
    REQUEST_UPDATE_PLAYER_PERMISSION,
    UPDATE_PLAYER_PERMISSION_FAILED
} from "../actions/playerPermission";
import {LOGOUT_SUCCESSFUL} from "../actions/user";

function playerPermission(state = {
    playableUsers: [],
    isFetchingPlayableUsers: false,
    fetchPlayableUsersFailed: false,

    permittedUsers: [],
    isFetchingPermittedUsers: false,
    fetchPermittedUsersFailed: false,

    isUpdatingPlayerPermission: false,
    updatePlayerPermissionFailed: false
}, action) {
    switch (action.type) {
        case REQUEST_FETCH_PLAYABLE_USERS:
            return {
                ...state,
                isFetchingPlayableUsers: true,
                fetchPlayableUsersFailed: false
            };
        case FETCH_PLAYABLE_USERS_SUCCESSFUL:
            return {
                ...state,
                isFetchingPlayableUsers: false,
                fetchPlayableUsersFailed: false,
                playableUsers: action.users
            };
        case FETCH_PLAYABLE_USERS_FAILED:
            return {
                ...state,
                isFetchingPlayableUsers: false,
                fetchPlayableUsersFailed: true,
                playableUsers: []
            };
        case REQUEST_FETCH_PERMITTED_USERS:
            return {
                ...state,
                isFetchingPermittedUsers: true,
                fetchPermittedUsersFailed: false
            };
        case FETCH_PERMITTED_USERS_SUCCESSFUL:
            return {
                ...state,
                isFetchingPermittedUsers: false,
                fetchPermittedUsersFailed: false,
                permittedUsers: action.users
            };
        case FETCH_PERMITTED_USERS_FAILED:
            return {
                ...state,
                isFetchingPermittedUsers: false,
                fetchPermittedUsersFailed: true,
                permittedUsers: []
            };
        case REQUEST_UPDATE_PLAYER_PERMISSION:
            return {
                ...state,
                isUpdatingPlayerPermission: true,
                updatePlayerPermissionFailed: false
            };
        case ADD_PLAYER_PERMISSION_SUCCESSFUL:
            let permittedUsersAfterAdd = state.permittedUsers.slice();
            permittedUsersAfterAdd.push(action.changedUser);
            return {
                ...state,
                isUpdatingPlayerPermission: false,
                updatePlayerPermissionFailed: false,
                permittedUsers: permittedUsersAfterAdd
            };
        case REMOVE_PLAYER_PERMISSION_SUCCESSFUL:
            let permittedUsersAfterRemove = state.permittedUsers.slice();
            let indexToRemove = permittedUsersAfterRemove.map(user => user.id).indexOf(action.changedUserId);
            if (indexToRemove !== -1) {
                permittedUsersAfterRemove.splice(indexToRemove, 1);
            }
            return {
                ...state,
                isUpdatingPlayerPermission: false,
                updatePlayerPermissionFailed: false,
                permittedUsers: permittedUsersAfterRemove
            };
        case UPDATE_PLAYER_PERMISSION_FAILED:
            return {
                ...state,
                isUpdatingPlayerPermission: false,
                updatePlayerPermissionFailed: true
            };
        case LOGOUT_SUCCESSFUL:
            return {
                ...state,
                playableUsers: [],
                permittedUsers: []
            };
        default:
            return state
    }
}

export default playerPermission;