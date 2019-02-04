import {FETCH_STATISTICS_FAILED, FETCH_STATISTICS_SUCCESSFUL, REQUEST_FETCH_STATISTICS} from "../actions/statistics";
import SortUtil from "../util/SortUtil";

function statistics(state = {
    isFetching: false,
    totalGames: 0,
    totalDarts: 0,
    possibleCheckoutDarts: 0,
    checkoutDarts: 0,
    gamesWon: 0,
    gamesLost: 0,
    dartData: [],
    gamesData: []
}, action) {
    switch (action.type) {
        case REQUEST_FETCH_STATISTICS:
            return {
                ...state,
                isFetching: true
            };
        case FETCH_STATISTICS_SUCCESSFUL:
            let dartData = [];
            let darts = action.data.darts.countsPerScore;
            for (let property in darts) {
                if (darts.hasOwnProperty(property)) {
                    dartData.push({
                        score: property,
                        singleCount: darts[property].singleCount,
                        doubleCount: property === "0" ? undefined : darts[property].doubleCount,
                        tripleCount: property === "25" || property === "0" ? undefined : darts[property].tripleCount
                    });
                }
            }
            dartData.sort(SortUtil.sortDartDataByScoreDesc);

            let gamesData = [];
            let games = action.data.games.countsPerPlayer;
            for (let property in games) {
                if (games.hasOwnProperty(property)) {
                    gamesData.push({
                        opponent: property,
                        wonCount: games[property].wonCount,
                        lostCount: games[property].lostCount
                    });
                }
            }
            gamesData.sort(SortUtil.sortGameDataByOpponentAsc);
            return {
                ...state,
                isFetching: false,
                gamesWon: action.data.games.wonCount,
                gamesLost: action.data.games.lostCount,
                totalDarts: action.data.darts.totalCount,
                possibleCheckoutDarts: action.data.darts.possibleCheckoutCount,
                checkoutDarts: action.data.darts.checkoutCount,
                dartData,
                gamesData
            };
        case FETCH_STATISTICS_FAILED:
            return {
                ...state,
                isFetching: false
            };
        default:
            return state
    }
}

export default statistics;