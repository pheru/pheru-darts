import {connect} from 'react-redux'
import Statistics from "../../../components/views/statistics/Statistics";
import {showLoginModal} from "../../../actions/user";
import {fetchStatistics, fetchStatisticsFilterOptions} from "../../../actions/statistics";

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    isFetchingStatistics: state.statistics.isFetching,
    gamesWon : state.statistics.gamesWon,
    gamesLost : state.statistics.gamesLost,
    totalDarts : state.statistics.totalDarts,
    possibleCheckoutDarts : state.statistics.possibleCheckoutDarts,
    checkoutDarts: state.statistics.checkoutDarts,
    dartData : state.statistics.dartData,
    gamesData: state.statistics.gamesData,
    options: state.statistics.options
});

const mapDispatchToProps = dispatch => ({
    showLogin: () => dispatch(showLoginModal()),
    fetchStatistics: (filter) => dispatch(fetchStatistics(filter)),
    fetchStatisticsFilterOptions: () => dispatch(fetchStatisticsFilterOptions())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Statistics)