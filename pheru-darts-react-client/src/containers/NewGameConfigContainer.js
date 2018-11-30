import {connect} from 'react-redux'
import {startNewGame} from "../actions/game";
import NewGameConfig from "../components/views/newgame/NewGameConfig";
import {memorizeState} from "../actions/stateMemory";
import {sortPlayerByNameAsc} from "../services/sortService";
import {showConfirmation, showWarning} from "../actions/modal";

const mapStateToProps = (state, ownProps) => ({
    initialState: state.stateMemory.states[getMemoryKeyByProps(ownProps)],
    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    userId: state.user.id,
    playableUsers: state.playerPermission.playableUsers.sort(sortPlayerByNameAsc),
    gameRunning: state.game !== null,
    fetchAllUsersFailed: state.playerPermission.fetchPlayableUsersFailed,
    isFetchingUsers: state.playerPermission.isFetchingPlayableUsers
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    startNewGame: (players, score, checkInMode, checkOutMode, training) =>
        dispatch(startNewGame(players, score, checkInMode, checkOutMode, training)),
    memorizeState: (state) => dispatch(memorizeState(getMemoryKeyByProps(ownProps), state)),
    showWarning: (title, message) => dispatch(showWarning(title, message)),
    showConfirmation: (title, message, onConfirm, onCancel) => dispatch(showConfirmation(title, message, onConfirm, onCancel))
});

function getMemoryKeyByProps(ownProps) {
    return ownProps.training ? "newgameconfig_training" : "newgameconfig";
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGameConfig)