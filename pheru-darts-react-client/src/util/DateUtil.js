class DateUtil {
    static toDate(date, options) {
        if (options && options.replaceToday && isToday(date)) {
            return "Heute";
        } else if (options && options.replaceYesterday && isYesterday(date)) {
            return "Gestern";
        } else {
            let day = toDoubleDigit(date.getDate().toString());
            let month = toDoubleDigit((date.getMonth() + 1).toString()); // +1 da getMonth 0-11 liefert
            let year = date.getFullYear().toString();
            return day + "." + month + "." + year;
        }
    }

    static toTime(date) {
        let hours = toDoubleDigit(date.getHours().toString());
        let minutes = toDoubleDigit(date.getMinutes().toString());
        return hours + ":" + minutes + " Uhr";
    }
}

function isToday(date) {
    return isSameDay(new Date(), date);
}

function isYesterday(date) {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(yesterday, date);
}

function isSameDay(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}

function toDoubleDigit(s) {
    if (s < 10) {
        return "0" + s;
    }
    return s;
}

export default DateUtil;