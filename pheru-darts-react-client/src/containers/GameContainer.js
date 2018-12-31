import {connect} from 'react-redux'
import Game from "../components/views/game/Game";
import {exitGame, rematch, undoDart} from "../actions/game";
import {archiveGame} from "../actions/games";
import {toggleSpeechOutput} from "../actions/speech";

const mapStateToProps = function (state) {
    let startScore = state.game.score;
    let checkInMode = state.game.checkInMode;
    let checkOutMode = state.game.checkOutMode;
    let players = state.game.players;
    let winner = state.game.winner;
    let game = state.game;
    let training = state.game.training;
    let announcementText = state.game.announcementText;
    let isLoggedIn = state.user.isLoggedIn;
    let selectedVoice = state.speech.selectedVoice;
    let speechOutputActive = state.speech.speechOutputActive;
    return {
        startScore,
        checkInMode,
        checkOutMode,
        players,
        winner,
        game,
        training,
        announcementText,
        isLoggedIn,
        selectedVoice,
        speechOutputActive
    };
};

const mapDispatchToProps = dispatch => ({
    undoDart: () => dispatch(undoDart()),
    exit: () => dispatch(exitGame()),
    rematch: (startingPlayer) => dispatch(rematch(startingPlayer)),
    archiveGame: (game) => dispatch(archiveGame(game)),
    toggleSpeechOutput: () => dispatch(toggleSpeechOutput())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)