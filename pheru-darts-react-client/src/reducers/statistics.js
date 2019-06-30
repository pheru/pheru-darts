import {
    REQUEST_FETCH_STATISTICS_FILTER_OPTIONS,
    FETCH_STATISTICS_FILTER_OPTIONS_SUCCESSFUL,
    FETCH_STATISTICS_FILTER_OPTIONS_FAILED,
    REQUEST_FETCH_STATISTICS,
    FETCH_STATISTICS_SUCCESSFUL,
    FETCH_STATISTICS_FAILED
} from "../actions/statistics";
import SortUtil from "../util/SortUtil";

function statistics(state = {
    isFetchingOptions: false,
    isFetching: false,
    totalGames: 0,
    totalDarts: 0,
    possibleCheckoutDarts: 0,
    checkoutDarts: 0,
    gamesWon: 0,
    gamesLost: 0,
    dartData: [],
    gamesData: [],
    averageAufnahmeScore: 0.0,
    highestAufnahmen: {},
    options: {
        usernameToUserIds: {},
        comparativeOperators: [],
        games: []
    }
}, action) {
    switch (action.type) {
        case REQUEST_FETCH_STATISTICS_FILTER_OPTIONS:
            return {
                ...state,
                isFetchingOptions: true
            };
        case FETCH_STATISTICS_FILTER_OPTIONS_SUCCESSFUL:
            return {
                ...state,
                isFetchingOptions: false,
                options: {
                    usernameToUserIds: action.options.usernameToUserIds,
                    comparativeOperators: action.options.comparativeOperators,
                    games: action.options.games
                }
            };
        case FETCH_STATISTICS_FILTER_OPTIONS_FAILED:
            return {
                ...state,
                isFetchingOptions: false
            };
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
            dartData.sort(SortUtil.sortByScoreDesc);

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
            gamesData.sort(SortUtil.sortByOpponentAsc);

            let progressData = action.data.progress.slice().sort(SortUtil.sortByGameInformationTimestampAsc);
            return {
                ...state,
                isFetching: false,
                gamesWon: action.data.games.wonCount,
                gamesLost: action.data.games.lostCount,
                totalDarts: action.data.darts.totalCount,
                possibleCheckoutDarts: action.data.darts.possibleCheckoutCount,
                checkoutDarts: action.data.darts.checkoutCount,
                averageAufnahmeScore: action.data.aufnahmen.averageAufnahmeScore,
                highestAufnahmen: action.data.aufnahmen.highestAufnahmen,
                dartData,
                gamesData,
                progressData
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