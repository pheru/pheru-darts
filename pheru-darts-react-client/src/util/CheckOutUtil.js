import POSSIBLE_CHECKOUTS from "./PossibleCheckouts";
import {SINGLE_IN} from "../constants/checkinModes";

class CheckOutUtil {

    static getPossibleCheckout(score, dartCount, checkInMode, checkOutMode, checkInCondition) {
        let showCheckInWarning = false;
        let forCheckIn = POSSIBLE_CHECKOUTS[checkInMode.key];
        if (!forCheckIn) {
            showCheckInWarning = !checkInCondition;
            forCheckIn = POSSIBLE_CHECKOUTS[SINGLE_IN.key];
        }
        let forCheckOut = forCheckIn[checkOutMode.key];
        if (!forCheckOut) {
            return "Keine Finish-Angaben für Modus: [" + checkOutMode.text + "]";
        }
        let forCountAndScore = forCheckOut[dartCount][score];
        if (!forCountAndScore) {
            return "Keine Finish möglich";
        } else {
            return forCountAndScore + (showCheckInWarning ? " (Ungeachtet Check-In)" : "");
        }
    }
}
export default CheckOutUtil;