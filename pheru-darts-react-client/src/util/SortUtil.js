const scoreBoardOrder = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

class SortUtil {
    static sortByNameAsc(a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    }

    static sortByScoreDesc(a, b) {
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

    static sortScoreByBoardOrder(a, b) {
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

    static sortByOpponentAsc(a, b) {
        if (a.opponent > b.opponent) {
            return 1;
        }
        if (a.opponent < b.opponent) {
            return -1;
        }
        return 0;
    }

    static sortByLabelAsc(a, b) {
        if (a.label > b.label) {
            return 1;
        }
        if (a.label < b.label) {
            return -1;
        }
        return 0;
    }

    static sortByTimestampDesc(a, b) {
        if (a.timestamp < b.timestamp) {
            return 1;
        }
        if (a.timestamp > b.timestamp) {
            return -1;
        }
        return 0;
    }

    static sortByTimestampAsc(a, b) {
        if (a.timestamp > b.timestamp) {
            return 1;
        }
        if (a.timestamp < b.timestamp) {
            return -1;
        }
        return 0;
    }

    static sortByGameInformationTimestampAsc(a, b) {
        return SortUtil.sortByTimestampAsc(a.gameInformation, b.gameInformation);
    }
}

export default SortUtil;