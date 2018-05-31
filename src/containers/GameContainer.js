import {connect} from 'react-redux'
import Game from "../components/Game";
import {exitGame, rematch, undoDart} from "../actions/game";
import getTurnInformation from "../services/gameInformationService";

const mapStateToProps = function (state) {
    let players = state.game.players;
    let startScore = state.game.score;
    let checkOutMode = state.game.checkOutMode;
    let turnInfo = getTurnInformation(players, startScore, checkOutMode);
    let finished = false;
    for (let i = 0; i < turnInfo.playerInformation.length; i++) {
        if (turnInfo.playerInformation[i].score === 0) {
            finished = true;
            break;
        }
    }
    return {
        finished
    };
};

const mapDispatchToProps = dispatch => ({
    undoDart: () => dispatch(undoDart()),
    exit: () => dispatch(exitGame()),
    rematch: () => dispatch(rematch())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)
