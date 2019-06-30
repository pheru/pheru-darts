import ConfigUtil from "../util/ConfigUtil";
import FetchUtil from "../util/FetchUtil";
import {showError} from "./modal";
import ActionUtil from "../util/ActionUtil";

export const REQUEST_FETCH_STATISTICS = 'REQUEST_FETCH_STATISTICS';
export const FETCH_STATISTICS_SUCCESSFUL = 'FETCH_STATISTICS_SUCCESSFUL';
export const FETCH_STATISTICS_FAILED = 'FETCH_STATISTICS_FAILED';

export const REQUEST_FETCH_STATISTICS_FILTER_OPTIONS = 'REQUEST_FETCH_STATISTICS_FILTER_OPTIONS';
export const FETCH_STATISTICS_FILTER_OPTIONS_SUCCESSFUL = 'FETCH_STATISTICS_FILTER_OPTIONS_SUCCESSFUL';
export const FETCH_STATISTICS_FILTER_OPTIONS_FAILED = 'FETCH_STATISTICS_FILTER_OPTIONS_FAILED';

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

export const requestFetchStatisticsFilterOptions = () => ({
    type: REQUEST_FETCH_STATISTICS_FILTER_OPTIONS
});
export const fetchStatisticsFilterOptionsSuccessful = (options) => ({
    type: FETCH_STATISTICS_FILTER_OPTIONS_SUCCESSFUL,
    options
});
export const fetchStatisticsFilterOptionsFailed = (message) => ({
    type: FETCH_STATISTICS_FILTER_OPTIONS_FAILED,
    message
});

export function fetchStatistics(filter) {
    return function (dispatch) {
        dispatch(requestFetchStatistics());
        return FetchUtil.fetchPost(ConfigUtil.getConfig().resourceUrls.statistic,
            filter,
            json => dispatch(fetchStatisticsSuccessful(json)),
            responseNotOk => {
                dispatch(fetchStatisticsFailed(responseNotOk.message));
                ActionUtil.defaultErrorHandling(dispatch, responseNotOk, showError("Failed to fetch statistics", responseNotOk.message));
            },
            error => {
                dispatch(fetchStatisticsFailed(error.message));
                dispatch(showError("Failed to fetch statistics", error.message));
            }
        );
    };
}

export function fetchStatisticsFilterOptions() {
    return function (dispatch) {
        dispatch(requestFetchStatisticsFilterOptions());
        return FetchUtil.fetchGet(ConfigUtil.getConfig().resourceUrls.statistic + "/filterOptions",
            json => dispatch(fetchStatisticsFilterOptionsSuccessful(json)),
            responseNotOk => {
                dispatch(fetchStatisticsFilterOptionsFailed(responseNotOk.message));
                ActionUtil.defaultErrorHandling(dispatch, responseNotOk, showError("Failed to fetch statistics filter options", responseNotOk.message));
            },
            error => {
                dispatch(fetchStatisticsFilterOptionsFailed(error.message));
                dispatch(showError("Failed to fetch statistics filter options", error.message));
            }
        );
    };
}