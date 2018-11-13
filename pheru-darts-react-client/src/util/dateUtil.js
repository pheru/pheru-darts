export function toDate(date, options){
    if (options && options.replaceToday && isToday(date)) {
        return "Heute";
    } else if (options && options.replaceYesterday && isYesterday(date)) {
        return "Gestern";
    } else {
        let day = date.getDate().toString();
        let month = date.getMonth().toString();
        let year = date.getFullYear().toString();
        return day + "." + month + "." + year;
    }
}

export function toTime(date){
    let hours = date.getHours().toString();
    if (date.getHours() < 10) {
        hours = "0" + hours;
    }
    let minutes = date.getMinutes().toString();
    if (date.getMinutes() < 10) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes + " Uhr";
}

function isToday(date) {
    return new Date().toDateString() === date.toDateString();
}

function isYesterday(date) {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString() === date.toDateString();
}