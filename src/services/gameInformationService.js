import {DOUBLE_OUT, SINGLE_OUT} from "../constants/checkoutModes";

// export function test(players, startScore, checkOutMode) {
//     let turnInformation = {};
//     turnInformation.playerInformation = [];
//
//     let currentPlayerIndex = 0;
//     let currentPlayerAufnahmen = players[0].aufnahmen.length;
//     for (let i = 0; i < players.length; i++) {
//         let player = players[i];
//         turnInformation.playerInformation[i] = getPlayerInformation(player, startScore, checkOutMode);
//         if (player.aufnahmen.length < currentPlayerAufnahmen) {
//             currentPlayerIndex = i;
//         }
//     }
//     turnInformation.currentPlayerIndex = currentPlayerIndex;
//     turnInformation.currentPlayer = players[currentPlayerIndex];
//     return turnInformation;
// }
//
// export function getPlayerInformation(player, startScore, checkOutMode) {
//     let score = startScore;
//     let dartCount = 0;
//     let average = 0.0;
//     let darts = [];
//     let lastAufnahmeIndex = 0;
//     let lastAufnahmeFinished = false;
//     let lastDart = 0;
//     for (let i = 0; i < player.aufnahmen.length; i++) {
//         lastAufnahmeIndex = i;
//         let aufnahmeStartScore = score;
//         let aufnahme = player.aufnahmen[i];
//         for (let j = 0; j < aufnahme.length; j++) {
//             lastDart = j;
//             let dart = aufnahme[j];
//             let dartScore = dart.value * dart.multiplier;
//             let checkOutCondition = (checkOutMode === SINGLE_OUT && dart.multiplier === 1) || (checkOutMode === DOUBLE_OUT && dart.multiplier === 2);
//             // ausgecheckt
//             if (score - dartScore === 0 && checkOutCondition) {
//                 return 0;
//             }
//             // ueberworfen
//             if (score - dartScore <= 0) {
//                 score = aufnahmeStartScore;
//                 lastAufnahmeFinished = true;
//                 break;
//             }
//             score -= dartScore;
//             if (j >= 2) {
//                 lastAufnahmeFinished = true;
//             }
//         }
//     }
//     let currentAufnahmeIndex = lastAufnahmeIndex;
//     let previousAufnahmeIndex = currentAufnahmeIndex - 1;
//     let currentDart = lastDart;
//     if (lastAufnahmeFinished) {
//         currentAufnahmeIndex++;
//         prev
//         currentDart = 0;
//     }
//     let previousDart = player.aufnahmen[previousAufnahmeIndex].length - 1;
//     return {score, currentAufnahmeIndex, previousAufnahmeIndex};
// }

function getTurnInformation(players, startScore, checkOutMode) {
    let playerInformationList = [];
    for (let i = 0; i < players.length; i++) {
        playerInformationList[i] = {
            score: startScore,
            dartCount: 0,
            average: 0.0
        };
    }

    let playerIndex = 0;
    let aufnahmeIndex = 0;
    let dartIndex = 0;

    let prevPlayerIndex;
    let prevAufnahmeIndex;
    let prevDartIndex;

    let aufnahmeStartScore = startScore;
    while (players[playerIndex].aufnahmen[aufnahmeIndex] !== undefined
    && players[playerIndex].aufnahmen[aufnahmeIndex][dartIndex] !== undefined) {
        prevPlayerIndex = playerIndex;
        prevAufnahmeIndex = aufnahmeIndex;
        prevDartIndex = dartIndex;

        playerInformationList[playerIndex].dartCount++;

        let dart = players[playerIndex].aufnahmen[aufnahmeIndex][dartIndex];
        let dartScore = dart.value * dart.multiplier;
        let checkOutCondition = (checkOutMode === SINGLE_OUT && dart.multiplier === 1) || (checkOutMode === DOUBLE_OUT && dart.multiplier === 2);
        let score = playerInformationList[playerIndex].score;
        if (dartIndex === 0) {
            aufnahmeStartScore = score;
        }
        let thrownOver = score - dartScore <= 0;

        if (score - dartScore === 0 && checkOutCondition) { // ausgecheckt
            score = 0;
        } else if (thrownOver) { // ueberworfen
            score = aufnahmeStartScore;
        } else {
            score -= dartScore;
        }
        playerInformationList[playerIndex].score = score;

        if (!thrownOver && dartIndex < 2) {
            dartIndex++;
            continue;
        }
        dartIndex = 0;
        if (playerIndex < players.length - 1) {
            playerIndex++;
        } else {
            aufnahmeIndex++;
            playerIndex = 0;
        }
    }
    for (let i = 0; i < players.length; i++) {
        let average = 0.0;
        let aufnahmenCount = i === playerIndex ? players[i].aufnahmen.length - 1 : players[i].aufnahmen.length;
        if (aufnahmenCount > 0) {
            let currentAufnahmeScore = 0;
            if (i === playerIndex) {
                let currentAufnahme = players[i].aufnahmen[players[i].aufnahmen.length - 1];
                for (let i = 0; i < currentAufnahme.length; i++) {
                    currentAufnahmeScore += currentAufnahme[i].value * currentAufnahme[i].multiplier;
                }
                if (playerInformationList[i].score - currentAufnahmeScore <= 0) {
                    // Wenn ueberworfen zaehlt die Aufnahme nicht mehr
                    currentAufnahmeScore = 0;
                }
            }
            let scoreDifference = startScore - (playerInformationList[i].score + currentAufnahmeScore);
            average = scoreDifference / aufnahmenCount;
        }
        average = average.toFixed(2);
        playerInformationList[i].average = average;
    }

    return {
        turnInformation: {
            current: {playerIndex, aufnahmeIndex, dartIndex},
            previous: {
                playerIndex: prevPlayerIndex,
                aufnahmeIndex: prevAufnahmeIndex,
                dartIndex: prevDartIndex
            }
        },
        playerInformation: playerInformationList
    };
}

export default getTurnInformation;