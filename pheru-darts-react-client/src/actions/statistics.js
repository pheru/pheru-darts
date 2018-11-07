import {getConfig} from "../services/configService";
import {fetchGet} from "../services/fetchService";
import {showError} from "./modal";
import {defaultErrorHandling} from "../util/actionUtil";

export const REQUEST_FETCH_STATISTICS = 'REQUEST_FETCH_STATISTICS';
export const FETCH_STATISTICS_SUCCESSFUL = 'FETCH_STATISTICS_SUCCESSFUL';
export const FETCH_STATISTICS_FAILED = 'FETCH_STATISTICS_FAILED';

export const requestFetchStatistics = () => ({
    type: REQUEST_FETCH_STATISTICS
});
export const fetchStatisticsSuccessful = (data) => ({
    type: FETCH_STATISTICS_SUCCESSFUL,
    data
});
export const fetchStatisticsFailed = (message) => ({
    type: FETCH_STATISTICS_FAILED,
    message
});

export function fetchStatistics() {
    return function (dispatch) {
        dispatch(requestFetchStatistics());
        return fetchGet(getConfig().resourceUrls.statistic,
            json => dispatch(fetchStatisticsSuccessful(json)),
            responseNotOk => {
                dispatch(fetchStatisticsFailed(responseNotOk.message));
                defaultErrorHandling(dispatch, responseNotOk, showError("Failed to fetch statistics", responseNotOk.message));
            },
            error => {
                dispatch(fetchStatisticsFailed(error.message));
                dispatch(showError("Failed to fetch statistics", error.message));
            }
        );
    };
}



