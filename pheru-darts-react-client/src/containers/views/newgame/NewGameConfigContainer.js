import {connect} from 'react-redux'
import {startNewGame} from "../../../actions/game";
import NewGameConfig from "../../../components/views/newgame/NewGameConfig";
import {memorizeState} from "../../../actions/stateMemory";
import SortUtil from "../../../util/SortUtil";
import {showConfirmation, showWarning} from "../../../actions/modal";

const mapStateToProps = (state, ownProps) => ({
    landscapeOrientation: state.app.landscapeOrientation,
    initialState: state.stateMemory.states[getMemoryKeyByProps(ownProps)],
    isLoggedIn: state.user.isLoggedIn,
    isLoggingIn: state.user.isLoggingIn,
    userId: state.user.id,
    userName: state.user.name,
    playableUsers: putPlayerInFront(state.user.name, state.playerPermission.playableUsers.slice().sort(SortUtil.sortByNameAsc)),
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

function putPlayerInFront(name, players) {
    let index = -1;
    let player = undefined;
    for (let i = 0; i < players.length; i++) {
        if(players[i].name === name){
            index = i;
            player = players[i];
        }
    }
    if(index > -1){
        players.splice(index, 1);
        players.unshift(player);
    }
    return players;
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewGameConfig)