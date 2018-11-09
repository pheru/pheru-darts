import {connect} from 'react-redux'
import {startNewGame} from "../actions/game";
import NewGameConfig from "../components/NewGameConfig";
import {memorizeNewGameConfigState} from "../actions/stateMemory";
import {sortPlayerByNameAsc} from "../services/sortService";
import {showWarning} from "../actions/modal";

const mapStateToProps = state => ({
    initialState: state.stateMemory.newGameConfigState,
    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    playableUsers: state.playerPermission.playableUsers.sort(sortPlayerByNameAsc),
    gameRunning: state.game !== null,
    fetchAllUsersFailed: state.playerPermission.fetchPlayableUsersFailed,
    isFetchingUsers: state.playerPermission.isFetchingPlayableUsers
});

const mapDispatchToProps = dispatch => ({
    startNewGame: (players, score, checkOutMode) => dispatch(startNewGame(players, score, checkOutMode)),
    memorizeState: (state) => dispatch(memorizeNewGameConfigState(state)),
    showWarning: (title, message) => dispatch(showWarning(title, message))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGameConfig)