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

function playerPermission(state = {
    isFetchingPlayableUsers: false,
    isFetchingPermittedUsers: false,
    playableUserIds: [],
    permittedUserIds: [],
    isUpdatingPlayerPermission: false
}, action) {
    switch (action.type) {
        case REQUEST_FETCH_PLAYABLE_USERS:
            return {
                ...state,
                isFetchingPlayableUsers: true
            };
        case FETCH_PLAYABLE_USERS_SUCCESSFUL:
            return {
                ...state,
                isFetchingPlayableUsers: false,
                playableUserIds: action.userIds
            };
        case FETCH_PLAYABLE_USERS_FAILED:
            return {
                ...state,
                isFetchingPlayableUsers: false,
                playableUserIds: []
            };
        case REQUEST_FETCH_PERMITTED_USERS:
            return {
                ...state,
                isFetchingPermittedUsers: true
            };
        case FETCH_PERMITTED_USERS_SUCCESSFUL:
            return {
                ...state,
                isFetchingPermittedUsers: false,
                permittedUserIds: action.userIds
            };
        case FETCH_PERMITTED_USERS_FAILED:
            return {
                ...state,
                isFetchingPermittedUsers: false,
                permittedUserIds: []
            };
        case REQUEST_UPDATE_PLAYER_PERMISSION:
            return {
                ...state,
                isUpdatingPlayerPermission: true
            };
        case ADD_PLAYER_PERMISSION_SUCCESSFUL:
            let permittedUserIdsAfterAdd = state.permittedUserIds.slice();
            permittedUserIdsAfterAdd.push(action.changedUserId);
            return {
                ...state,
                isUpdatingPlayerPermission: false,
                permittedUserIds: permittedUserIdsAfterAdd
            };
        case REMOVE_PLAYER_PERMISSION_SUCCESSFUL:
            let permittedUserIdsAfterRemove = state.permittedUserIds.slice();
            let indexToRemove = permittedUserIdsAfterRemove.indexOf(action.changedUserId);
            if (indexToRemove !== -1) {
                permittedUserIdsAfterRemove.splice(indexToRemove, 1);
            }
            return {
                ...state,
                isUpdatingPlayerPermission: false,
                permittedUserIds: permittedUserIdsAfterRemove
            };
        case UPDATE_PLAYER_PERMISSION_FAILED:
            return {
                ...state,
                isUpdatingPlayerPermission: false //TODO Fehlerbehandlung
            };
        default:
            return state
    }
}

export default playerPermission;
