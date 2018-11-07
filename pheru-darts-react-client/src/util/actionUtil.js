import {logout} from "../actions/user";
import {showInformation} from "../actions/modal";

export function defaultErrorHandling(dispatch, response, errorAction) {
    if (response.status === 401) {
        dispatch(logout());
        if (response.message === "JWT expired!") {
            dispatch(showInformation("Deine Sitzung ist abgelaufen", "Bitte melde dich erneut an"));
        } else {
            dispatch(errorAction);
        }
    } else {
        dispatch(errorAction);
    }
}
