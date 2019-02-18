import POSSIBLE_CHECKOUTS from "./PossibleCheckouts";
import {SINGLE_IN} from "../constants/checkinModes";

class CheckOutUtil {

    static getPossibleCheckout(score, dartCount, checkInMode, checkOutMode, checkInCondition) {
        let forCheckIn = POSSIBLE_CHECKOUTS[SINGLE_IN.key];
        let forCheckOut = forCheckIn[checkOutMode.key];
        if (!forCheckOut) {
            return "Keine Finish-Angaben für Modus: [" + checkOutMode.text + "]";
        }
        if (checkInMode !== SINGLE_IN && !checkInCondition) {
            return "Keine Finish-Angabe solange Check-In nicht erfüllt"
        }
        let forCountAndScore = forCheckOut[dartCount][score];
        if (!forCountAndScore) {
            return "Kein Finish möglich";
        } else {
            return forCountAndScore;
        }
    }
}

export default CheckOutUtil;