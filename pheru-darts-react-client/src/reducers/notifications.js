import {
    FETCH_NOTIFICATIONS_FAILED,
    FETCH_NOTIFICATIONS_SUCCESSFUL,
    MARK_NOTIFICATIONS_AS_READ_FAILED,
    MARK_NOTIFICATIONS_AS_READ_SUCCESSFUL,
    REQUEST_FETCH_NOTIFICATIONS,
    REQUEST_MARK_NOTIFICATIONS_AS_READ
} from "../actions/notifications";
import {LOGOUT_SUCCESSFUL} from "../actions/user";

const INITIAL_STATE = {
    isFetching: false,
    notifications: [],
    unreadNotifications: []
};

function notifications(state = INITIAL_STATE, action) {
    switch (action.type) {
        case REQUEST_FETCH_NOTIFICATIONS:
            return {
                ...state,
                isFetching: true
            };
        case FETCH_NOTIFICATIONS_SUCCESSFUL:
            let unread = getUnreadNotifications(action.notifications);
            return {
                ...state,
                isFetching: false,
                notifications: action.notifications,
                unreadNotifications: unread
            };
        case FETCH_NOTIFICATIONS_FAILED:
            return INITIAL_STATE;
        case REQUEST_MARK_NOTIFICATIONS_AS_READ:
            return {
                ...state,
                isFetching: true
            };
        case MARK_NOTIFICATIONS_AS_READ_SUCCESSFUL:
            let newNotifications = [];
            for (let i = 0; i < state.notifications.length; i++) {
                let notification = {...state.notifications[i]};
                for (let j = 0; j < action.notifications.length; j++) {
                    if (notification.id === action.notifications[j].id) {
                        notification.read = action.notifications[j].read;
                        break;
                    }
                }
                newNotifications.push(notification);
            }
            let newUnread = getUnreadNotifications(newNotifications);
            return {
                ...state,
                isFetching: false,
                notifications: newNotifications,
                unreadNotifications: newUnread
            };
        case MARK_NOTIFICATIONS_AS_READ_FAILED:
            return {
                ...state,
                isFetching: false
            };
        case LOGOUT_SUCCESSFUL:
            return INITIAL_STATE;
        default:
            return state
    }
}

function getUnreadNotifications(allNotifications) {
    let unread = [];
    for (let i = 0; i < allNotifications.length; i++) {
        if (!allNotifications[i].read) {
            unread.push(allNotifications[i]);
        }
    }
    return unread;
}

export default notifications;