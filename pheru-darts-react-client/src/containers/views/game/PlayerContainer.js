import {connect} from 'react-redux'
import Player from "../../../components/views/game/Player";
import getTurnInformation from "../../../services/gameInformationService";

// TODO turninfo in game -> kein container mehr
const mapStateToProps = function (state, ownProps) {
    let players = state.game.players;
    let player = players[ownProps.index];
    let startScore = state.game.score;
    let checkOutMode = state.game.checkOutMode;
    let checkInMode = state.game.checkInMode;
    let turnInfo = getTurnInformation(players, startScore, checkInMode, checkOutMode);

    let score = turnInfo.playerInformation[ownProps.index].score;
    let darts = getDarts(player);
    let dartCount = turnInfo.playerInformation[ownProps.index].dartCount;
    let current = turnInfo.turnInformation.current.playerIndex === ownProps.index;
    let average = turnInfo.playerInformation[ownProps.index].average;
    return {
        landscapeOrientation: state.app.landscapeOrientation,
        name: player.name,
        score: score,
        dartCount: dartCount,
        average: average,
        dart1: darts[0],
        dart2: darts[1],
        dart3: darts[2],
        current: current
    };
};

function getDarts(player) {
    let darts = [];
    let aufnahme = player.aufnahmen[player.aufnahmen.length - 1];
    if (aufnahme !== undefined) {
        for (let j = 0; j < aufnahme.length; j++) {
            let dart = aufnahme[j];
            let prefix;
            switch (dart.multiplier) {
                case 2:
                    prefix = 'D';
                    break;
                case 3:
                    prefix = 'T';
                    break;
                default:
                    prefix = '';
            }
            darts.push(prefix + dart.value);
        }
    }
    for (let i = 0; i < 3; i++) {
        if (darts[i] === undefined) {
            darts[i] = "-";
        }
    }
    return darts;
}

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player)