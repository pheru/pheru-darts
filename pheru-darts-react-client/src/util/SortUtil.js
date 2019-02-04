const scoreBoardOrder = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

class SortUtil {
    static sortPlayerByNameAsc(a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    }

    static sortDartDataByScoreDesc(a, b) {
        let scoreA = parseInt(a.score, 10);
        let scoreB = parseInt(b.score, 10);
        if (scoreA < scoreB) {
            return 1;
        }
        if (scoreA > scoreB) {
            return -1;
        }
        return 0;
    }

    static sortDartDataByScoreBoardOrder(a, b) {
        let scoreA = parseInt(a.score, 10);
        let scoreB = parseInt(b.score, 10);
        let scoreAIndex = scoreBoardOrder.indexOf(scoreA);
        let scoreBIndex = scoreBoardOrder.indexOf(scoreB);

        if (scoreAIndex > scoreBIndex) {
            return 1;
        }
        if (scoreAIndex < scoreBIndex) {
            return -1;
        }
        return 0;
    }

    static sortGameDataByOpponentAsc(a, b) {
        if (a.opponent > b.opponent) {
            return 1;
        }
        if (a.opponent < b.opponent) {
            return -1;
        }
        return 0;
    }
}

export default SortUtil;