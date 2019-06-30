import DateUtil from "./DateUtil";

class StatisticUtil {
    static labelTextForGameInformation(gameInformation) {
        let gameNumber = gameInformation.gameNumber;
        let gameText = gameInformation.opponents.length > 0
            ? " vs. " + gameInformation.opponents.join() : " Training";
        let gameDate = DateUtil.toDate(new Date(gameInformation.timestamp),
            {replaceToday: true, replaceYesterday: true});
        let gameTime = DateUtil.toTime(new Date(gameInformation.timestamp));
        return gameText + " (" + gameDate + " " + gameTime + ") [#" + gameNumber + "]";
    }
}

export default StatisticUtil;