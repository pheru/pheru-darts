import DateUtil from "../../util/DateUtil";

// month ist immer index (0-11)
describe('dateUtil', () => {

    it('toTime', () => {
        let date = new Date(2000, 0, 1, 20, 21);
        expect(DateUtil.toTime(date)).toEqual("20:21 Uhr");
    });

    it('toDate no options', () => {
        let date = new Date(2000, 0, 1, 20, 21);
        expect(DateUtil.toDate(date)).toEqual("01.01.2000");
    });

    it('toDate replaceToday', () => {
        let today = new Date();
        let todayDay = today.getDate();
        let todayMonth = today.getMonth();
        let todayYear = today.getFullYear();

        let differentDate = new Date(2000, 0, 1, 20, 21);
        let sameDayDifferentMonthYear = new Date(2000, 0, todayDay, 20, 21);
        let sameDayMonthDifferentYear = new Date(2000, todayMonth, todayDay, 20, 21);
        let sameDayMonthYear = new Date(todayYear, todayMonth, todayDay, 20, 21);

        expect(DateUtil.toDate(differentDate, {replaceToday: true})).not.toEqual("Heute");
        expect(DateUtil.toDate(sameDayDifferentMonthYear, {replaceToday: true})).not.toEqual("Heute");
        expect(DateUtil.toDate(sameDayMonthDifferentYear, {replaceToday: true})).not.toEqual("Heute");
        expect(DateUtil.toDate(sameDayMonthYear, {replaceToday: true})).toEqual("Heute");
    });

    it('toDate replaceYesterday', () => {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let yesterdayDay = yesterday.getDate();
        let yesterdayMonth = yesterday.getMonth();
        let yesterdayYear = yesterday.getFullYear();

        let differentDate = new Date(2000, 7, 7, 20, 21);
        let expectedDayDifferentMonthYear = new Date(2000, 7, yesterdayDay, 20, 21);
        let expectedDayMonthDifferentYear = new Date(2000, yesterdayMonth, yesterdayDay, 20, 21);
        let expectedDayMonthYear = new Date(yesterdayYear, yesterdayMonth, yesterdayDay, 20, 21);

        expect(DateUtil.toDate(differentDate, {replaceYesterday: true})).not.toEqual("Gestern");
        expect(DateUtil.toDate(expectedDayDifferentMonthYear, {replaceYesterday: true})).not.toEqual("Gestern");
        expect(DateUtil.toDate(expectedDayMonthDifferentYear, {replaceYesterday: true})).not.toEqual("Gestern");
        expect(DateUtil.toDate(expectedDayMonthYear, {replaceYesterday: true})).toEqual("Gestern");
    });

});