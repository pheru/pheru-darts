import {connect} from 'react-redux'
import Statistics from "../../../components/views/statistics/Statistics";
import {showLoginModal} from "../../../actions/user";
import {fetchStatistics, fetchStatisticsFilterOptions} from "../../../actions/statistics";

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    isFetchingStatistics: state.statistics.isFetching,
    gamesWon : state.statistics.gamesWon,
    gamesLost : state.statistics.gamesLost,
    totalDarts : state.statistics.totalDarts,
    possibleCheckoutDarts : state.statistics.possibleCheckoutDarts,
    checkoutDarts: state.statistics.checkoutDarts,
    averageAufnahmeScore: state.statistics.averageAufnahmeScore,
    highestAufnahmen: state.statistics.highestAufnahmen,
    dartData : state.statistics.dartData,
    gamesData: state.statistics.gamesData,
    progressData: state.statistics.progressData,
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