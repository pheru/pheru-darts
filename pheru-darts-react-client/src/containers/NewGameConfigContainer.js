import {connect} from 'react-redux'
import {startNewGame} from "../actions/game";
import NewGameConfig from "../components/NewGameConfig";
import {filterUserByIds} from "../services/userFilterService";

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    playableUsers: filterUserByIds(state.users.all, state.playerPermission.playableUserIds),
    gameRunning: state.game !== null,
    fetchAllUsersFailed: state.users.fetchFailed,
    isFetchingUsers: state.users.isFetching
});

const mapDispatchToProps = dispatch => ({
    startNewGame: (players, score, checkOutMode) => dispatch(startNewGame(players, score, checkOutMode))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGameConfig)
