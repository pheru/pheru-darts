import {DOUBLE_OUT, SINGLE_OUT} from "../constants/checkoutModes";

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
        let thrownOver = isThrownOver(score, dart, checkOutMode);

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

function isThrownOver(score, dart, checkOutMode) {
    return score - dart.value * dart.multiplier <= (checkOutMode === SINGLE_OUT ? 0 : 1);
}

export default getTurnInformation;