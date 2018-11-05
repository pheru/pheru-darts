import {logout} from "../actions/user";
import {showError} from "../actions/errors";

export function defaultErrorHandling(dispatch, response, errorAction) {
    if (response.status === 401) {
        dispatch(logout());
        if (response.message === "JWT expired!") {
            dispatch(showError("Sitzung abgelaufen", "Bitte melde dich neu an"));
        } else {
            dispatch(errorAction);
        }
    } else {
        dispatch(errorAction);
    }
}
