import ConfigUtil from "../util/ConfigUtil";
import FetchUtil from "../util/FetchUtil";
import {showError} from "./modal";
import ActionUtil from "../util/ActionUtil";

export const REQUEST_FETCH_NOTIFICATIONS = 'REQUEST_FETCH_NOTIFICATIONS';
export const FETCH_NOTIFICATIONS_SUCCESSFUL = 'FETCH_NOTIFICATIONS_SUCCESSFUL';
export const FETCH_NOTIFICATIONS_FAILED = 'FETCH_NOTIFICATIONS_FAILED';

export const REQUEST_MARK_NOTIFICATIONS_AS_READ = 'REQUEST_MARK_NOTIFICATIONS_AS_READ';
export const MARK_NOTIFICATIONS_AS_READ_SUCCESSFUL = 'MARK_NOTIFICATIONS_AS_READ_SUCCESSFUL';
export const MARK_NOTIFICATIONS_AS_READ_FAILED = 'MARK_NOTIFICATIONS_AS_READ_FAILED';

export const requestFetchNotifications = () => ({
    type: REQUEST_FETCH_NOTIFICATIONS
});
export const fetchNotificationsSuccessful = (notifications) => ({
    type: FETCH_NOTIFICATIONS_SUCCESSFUL,
    notifications
});
export const fetchNotificationsFailed = (message) => ({
    type: FETCH_NOTIFICATIONS_FAILED,
    message
});

export const requestMarkNotificationsAsRead = (notificationIds) => ({
    type: REQUEST_MARK_NOTIFICATIONS_AS_READ,
    notificationIds
});
export const markNotificationsAsReadSuccessful = (notifications) => ({
    type: MARK_NOTIFICATIONS_AS_READ_SUCCESSFUL,
    notifications
});
export const markNotificationsAsReadFailed = (message) => ({
    type: MARK_NOTIFICATIONS_AS_READ_FAILED,
    message
});

export function fetchNotifications() {
    return function (dispatch) {
        dispatch(requestFetchNotifications());
        return FetchUtil.fetchGet(ConfigUtil.getConfig().resourceUrls.notification,
            json => dispatch(fetchNotificationsSuccessful(json)),
            responseNotOk => {
                dispatch(fetchNotificationsFailed(responseNotOk.message));
                ActionUtil.defaultErrorHandling(dispatch, responseNotOk, showError("Failed to fetch notifications", responseNotOk.message));
            },
            error => {
                dispatch(fetchNotificationsFailed(error.message));
                dispatch(showError("Failed to fetch notifications", error.message));
            }
        );
    };
}

export function markNotificationsAsRead(notificationIds) {
    return function (dispatch) {
        dispatch(requestMarkNotificationsAsRead(notificationIds));
        return FetchUtil.fetchPut(ConfigUtil.getConfig().resourceUrls.notification,
            {
                ids: notificationIds,
                read: true
            },
            json => dispatch(markNotificationsAsReadSuccessful(json)),
            responseNotOk => {
                dispatch(markNotificationsAsReadFailed(responseNotOk.message));
                ActionUtil.defaultErrorHandling(dispatch, responseNotOk, showError("Failed to update notifications", responseNotOk.message));
            },
            error => {
                dispatch(markNotificationsAsReadFailed(error.message));
                dispatch(showError("Failed to update notifications", error.message));
            }
        );
    };
}



