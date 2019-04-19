import {logout} from "../actions/user";
import {showInformation} from "../actions/modal";

class ActionUtil {
    static defaultErrorHandling(dispatch, response, errorAction) {
        if (response.status === 401) {
            dispatch(logout());
            //TODO nicht anhand message festmachen?
            if (response.message === "JWT expired!") {
                dispatch(showInformation("Deine Sitzung ist abgelaufen", "Bitte melde dich erneut an"));
            } else {
                dispatch(errorAction);
            }
        } else {
            dispatch(errorAction);
        }
    }
}

export default ActionUtil;