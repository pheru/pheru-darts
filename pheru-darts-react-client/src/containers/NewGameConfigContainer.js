import {connect} from 'react-redux'
import {startNewGame} from "../actions/game";
import NewGameConfig from "../components/NewGameConfig";
import {filterUserByIds} from "../services/userFilterService";
import {memorizeNewGameConfigState} from "../actions/stateMemory";

const mapStateToProps = state => ({
    initialState: state.stateMemory.newGameConfigState,
    isLoggedIn: state.user.isLoggedIn,
    playableUsers: filterUserByIds(state.users.all, state.playerPermission.playableUserIds),
    gameRunning: state.game !== null,
    fetchAllUsersFailed: state.users.fetchFailed,
    isFetchingUsers: state.users.isFetching
});

const mapDispatchToProps = dispatch => ({
    startNewGame: (players, score, checkOutMode) => dispatch(startNewGame(players, score, checkOutMode)),
    memorizeState: (state) => dispatch(memorizeNewGameConfigState(state))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGameConfig)
