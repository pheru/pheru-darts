import {connect} from 'react-redux'
import Game from "../components/Game";
import {exitGame, rematch, undoDart} from "../actions/game";
import {archiveGame} from "../actions/games";

const mapStateToProps = function (state) {
    let startScore = state.game.score;
    let checkOutMode = state.game.checkOutMode;
    let players = state.game.players;
    let winner = state.game.winner;
    let game = state.game;
    let isArchiving = state.games.isArchiving;
    return {
        startScore,
        checkOutMode,
        players,
        winner,
        game,
        isArchiving
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