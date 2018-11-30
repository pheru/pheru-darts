import {connect} from 'react-redux'
import Game from "../components/views/game/Game";
import {exitGame, rematch, undoDart} from "../actions/game";
import {archiveGame} from "../actions/games";

const mapStateToProps = function (state) {
    let startScore = state.game.score;
    let checkInMode = state.game.checkInMode;
    let checkOutMode = state.game.checkOutMode;
    let players = state.game.players;
    let winner = state.game.winner;
    let game = state.game;
    let training = state.game.training;
    let isLoggedIn = state.user.isLoggedIn;
    return {
        startScore,
        checkInMode,
        checkOutMode,
        players,
        winner,
        game,
        training,
        isLoggedIn
    };
};

const mapDispatchToProps = dispatch => ({
    undoDart: () => dispatch(undoDart()),
    exit: () => dispatch(exitGame()),
    rematch: (startingPlayer) => dispatch(rematch(startingPlayer)),
    archiveGame: (game) => dispatch(archiveGame(game))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)