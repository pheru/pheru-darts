import {connect} from 'react-redux'
import Player from "../components/Player";
import getTurnInformation from "../services/gameInformationService";

const mapStateToProps = function (state, ownProps) {
    let players = state.game.players;
    let player = players[ownProps.index];
    let startScore = state.game.score;
    let checkOutMode = state.game.checkOutMode;
    let turnInfo = getTurnInformation(players, startScore, checkOutMode);

    let score = turnInfo.playerInformation[ownProps.index].score;
    let darts = getDarts(player);
    let dartCount = turnInfo.playerInformation[ownProps.index].dartCount;
    let current = turnInfo.turnInformation.current.playerIndex === ownProps.index;
    let average = turnInfo.playerInformation[ownProps.index].average;
    return {
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
//
// function getDartCount(player) {
//     let count = 0;
//     for (let i = 0; i < player.aufnahmen.length; i++) {
//         let aufnahme = player.aufnahmen[i];
//         for (let j = 0; j < aufnahme.length; j++) {
//             count++;
//         }
//     }
//     return count;
// }
//
// function computeAverage(aufnahmen, current, startScore, score) {
//     let aufnahmenCount = current ? aufnahmen.length - 1 : aufnahmen.length;
//     if (aufnahmenCount === 0) {
//         return 0.0;
//     }
//     let currentAufnahmeScore = 0;
//     if (current) {
//         let currentAufnahme = aufnahmen[aufnahmen.length - 1];
//         for (let i = 0; i < currentAufnahme.length; i++) {
//             currentAufnahmeScore += currentAufnahme[i].value * currentAufnahme[i].multiplier;
//         }
//     }
//     let scoreDifference = startScore - (score + currentAufnahmeScore);
//     let avg = scoreDifference / aufnahmenCount;
//     return avg.toFixed(2);
// }
//
// function computeIfCurrent(players, index, startScore, checkOutMode) {
//     let turnInfo = getTurnInformation(players, startScore, checkOutMode);
//     return turnInfo.current.playerIndex === index;
// }

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player)
