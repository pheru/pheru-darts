import {DOUBLE_OUT, MASTER_OUT, SINGLE_OUT} from "../constants/checkoutModes";
import {DOUBLE_IN, SINGLE_IN} from "../constants/checkinModes";

function getTurnInformation(players, startScore, checkInMode, checkOutMode) {
    let playerInformationList = [];
    for (let i = 0; i < players.length; i++) {
        playerInformationList[i] = {
            score: startScore,
            dartCount: 0,
            average: 0.0,
            checkInCondition: false
        };
    }

    let playerIndex = 0;
    let aufnahmeIndex = 0;
    let dartIndex = 0;

    let prevPlayerIndex;
    let prevAufnahmeIndex;
    let prevDartIndex;

    let lastTurnThrownOver = false;

    let aufnahmeStartScore = startScore;
    while (players[playerIndex].aufnahmen[aufnahmeIndex] !== undefined
    && players[playerIndex].aufnahmen[aufnahmeIndex][dartIndex] !== undefined) {
        lastTurnThrownOver = false;
        prevPlayerIndex = playerIndex;
        prevAufnahmeIndex = aufnahmeIndex;
        prevDartIndex = dartIndex;

        playerInformationList[playerIndex].dartCount++;

        let dart = players[playerIndex].aufnahmen[aufnahmeIndex][dartIndex];
        let dartScore = dart.value * dart.multiplier;
        let checkOutCondition = checkOutMode === SINGLE_OUT
            || (checkOutMode === DOUBLE_OUT && dart.multiplier === 2)
            || (checkOutMode === MASTER_OUT && (dart.multiplier === 2 || dart.multiplier === 3));
        let score = playerInformationList[playerIndex].score;
        let checkInCondition = playerInformationList[playerIndex].checkInCondition;
        if (dartIndex === 0) {
            aufnahmeStartScore = score;
        }
        let thrownOver = isThrownOver(score, dart, checkOutMode);

        if (!checkInCondition) {
            checkInCondition = checkInMode === SINGLE_IN || (checkInMode === DOUBLE_IN && dart.multiplier === 2);
            playerInformationList[playerIndex].checkInCondition = checkInCondition;
        }
        if (checkInCondition) {
            if (score - dartScore === 0 && checkOutCondition) { // ausgecheckt
                score = 0;
            } else if (thrownOver) { // ueberworfen
                score = aufnahmeStartScore;
                lastTurnThrownOver = true;
            } else {
                score -= dartScore;
            }
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
        // Bis zum erfolgreichen Check-In kann ansonsten ein negativer Average rauskommen
        if (average < 0.0) {
            average = 0.0;
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
                dartIndex: prevDartIndex,
                thrownOver: lastTurnThrownOver
            }
        },
        playerInformation: playerInformationList
    };
}

function isThrownOver(score, dart, checkOutMode) {
    return score - dart.value * dart.multiplier <= (checkOutMode === SINGLE_OUT ? 0 : 1);
}

export default getTurnInformation;