import {connect} from 'react-redux'
import Game from "../../../components/views/game/Game";
import {addDart, exitGame, rematch, undoDart} from "../../../actions/game";
import {archiveGame} from "../../../actions/games";
import {toggleSpeechOutput} from "../../../actions/speech";
import {toggleNavigationBarVisibility} from "../../../actions/app";

const mapStateToProps = function (state) {
    return {
        landscapeOrientation: state.app.landscapeOrientation,
        startScore: state.game.score,
        checkInMode: state.game.checkInMode,
        checkOutMode: state.game.checkOutMode,
        players: state.game.players,
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
    toggleNavigationBar: () => dispatch(toggleNavigationBarVisibility())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)