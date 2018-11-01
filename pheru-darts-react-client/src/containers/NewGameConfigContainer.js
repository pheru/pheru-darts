import {connect} from 'react-redux'
import {startNewGame} from "../actions/game";
import NewGameConfig from "../components/NewGameConfig";
import {memorizeNewGameConfigState} from "../actions/stateMemory";
import {sortPlayerByNameAsc} from "../services/sortService";

const mapStateToProps = state => ({
    initialState: state.stateMemory.newGameConfigState,
    isLoggedIn: state.user.isLoggedIn,
    playableUsers: state.playerPermission.playableUsers.sort(sortPlayerByNameAsc),
    gameRunning: state.game !== null,
    fetchAllUsersFailed: state.playerPermission.fetchPlayableUsersFailed,
    isFetchingUsers: state.playerPermission.isFetchingPlayableUsers
});

const mapDispatchToProps = dispatch => ({
    startNewGame: (players, score, checkOutMode) => dispatch(startNewGame(players, score, checkOutMode)),
    memorizeState: (state) => dispatch(memorizeNewGameConfigState(state))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGameConfig)