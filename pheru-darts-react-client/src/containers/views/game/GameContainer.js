import {connect} from 'react-redux'
import Game from "../../../components/views/game/Game";
import {addDart, exitGame, rematch, undoDart} from "../../../actions/game";
import {archiveGame} from "../../../actions/games";
import {toggleSpeechOutput} from "../../../actions/speech";
import {setNavigationBarVisibility, toggleNavigationBarVisibility} from "../../../actions/app";
import getTurnInformation from "../../../services/gameInformationService";

// TODO Mit Turninfo besser umgehen (nur hier und an die Player via props weitergeben, kein player container mehr)
const mapStateToProps = function (state) {
    let players = state.game.players;
    let startScore = state.game.score;
    let checkOutMode = state.game.checkOutMode;
    let checkInMode = state.game.checkInMode;
    let turnInfo = getTurnInformation(players, startScore, checkInMode, checkOutMode);

    let currentPlayerScore = turnInfo.playerInformation[turnInfo.turnInformation.current.playerIndex].score;
    let player = players[turnInfo.turnInformation.current.playerIndex];
    let currentPlayerDartsLeft = dartsLeft(player);
    let currentPlayerCheckinCondition = turnInfo.playerInformation[turnInfo.turnInformation.current.playerIndex].checkInCondition;

    return {
        landscapeOrientation: state.app.landscapeOrientation,
        startScore: state.game.score,
        checkInMode: state.game.checkInMode,
        checkOutMode: state.game.checkOutMode,
        players: state.game.players,
        currentPlayerScore,
        currentPlayerDartsLeft,
        currentPlayerCheckinCondition,
        winner: state.game.winner,
        game: state.game,
        training: state.game.training,
        announcementText: state.game.announcementText,
        isLoggedIn: state.user.isLoggedIn,
        selectedVoice: state.speech.selectedVoice ? state.speech.selectedVoice : state.speech.defaultVoice,
        speechOutputActive: state.speech.speechOutputActive,
        navigationBarVisible: state.app.navigationBarVisible
    };
};

const mapDispatchToProps = dispatch => ({
    addDart: (value, multiplier) => dispatch(addDart(value, multiplier)),
    undoDart: () => dispatch(undoDart()),
    exit: () => dispatch(exitGame()),
    rematch: (startingPlayer) => dispatch(rematch(startingPlayer)),
    archiveGame: (game) => dispatch(archiveGame(game)),
    toggleSpeechOutput: () => dispatch(toggleSpeechOutput()),
    toggleNavigationBar: () => dispatch(toggleNavigationBarVisibility()),
    setNavigationBarVisibility: (visibility) => dispatch(setNavigationBarVisibility(visibility))
});

function dartsLeft(player) {
    let aufnahme = player.aufnahmen[player.aufnahmen.length - 1];
    if (aufnahme !== undefined) {
        return 3 - aufnahme.length;
    } else {
        return 3;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)