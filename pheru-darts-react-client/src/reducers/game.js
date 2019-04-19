import {ADD_DART, EXIT_GAME, REMATCH, START_NEW_GAME, UNDO_DART} from "../actions/game";
import getTurnInformation from "../services/gameInformationService";

function game(state = null, action) {
    switch (action.type) {
        case START_NEW_GAME:
            let players = action.players;
            initPlayers(players);
            return {
                players: players,
                score: action.score,
                checkInMode: action.checkInMode,
                checkOutMode: action.checkOutMode,
                training: action.training
            };
        case ADD_DART:
            return addDart(state, {value: action.value, multiplier: action.multiplier});
        case UNDO_DART:
            return undoDart(state);
        case EXIT_GAME:
            return null;
        case REMATCH:
            let playersCopy = state.players.slice();
            while (playersCopy[0] !== action.startingPlayer) {
                playersCopy.push(playersCopy.shift());
            }
            initPlayers(playersCopy);
            return {
                ...state,
                players: playersCopy,
                announcementText: undefined,
                winner: undefined
            };
        default:
            return state
    }
}

function initPlayers(players) {
    for (let i = 0; i < players.length; i++) {
        players[i].aufnahmen = [];
    }
    players[0].aufnahmen[0] = [];
}

function addDart(state, dart) {
    let multiplier = dart.multiplier;
    if (dart.value === 25 && multiplier > 2) {
        return state;
    }
    if (dart.value === 0 && multiplier !== 1) {
        multiplier = 1;
    }
    let validatedDart = {...dart, multiplier};
    let players = state.players;

    let currentTurnInfo = getTurnInformation(players, state.score, state.checkInMode, state.checkOutMode).turnInformation.current;

    players[currentTurnInfo.playerIndex].aufnahmen[currentTurnInfo.aufnahmeIndex][currentTurnInfo.dartIndex] = validatedDart;

    let turnInfo = getTurnInformation(players, state.score, state.checkInMode, state.checkOutMode);
    currentTurnInfo = turnInfo.turnInformation.current;

    let announcementText = undefined;
    let playerChanged = players[currentTurnInfo.playerIndex].aufnahmen[currentTurnInfo.aufnahmeIndex] === undefined;
    if (playerChanged) {
        players[currentTurnInfo.playerIndex].aufnahmen[currentTurnInfo.aufnahmeIndex] = [];
        announcementText = state.players[currentTurnInfo.playerIndex].name + ", "
            + turnInfo.playerInformation[currentTurnInfo.playerIndex].score;
    }
    if (turnInfo.turnInformation.previous.thrownOver) {
        document.getElementById("audio_overthrown").play();
    } else if (playerChanged) {
        document.getElementById("audio_player_change").play();
    } else {
        document.getElementById("audio_scorebutton_click").play();
    }

    // Pruefen, ob jemand gewonnen hat
    let winner;
    for (let i = 0; i < turnInfo.playerInformation.length; i++) {
        if (turnInfo.playerInformation[i].score === 0) {
            winner = players[i];
            announcementText = players[i].name + " hat gewonnen!";
            break;
        }
    }
    return {
        ...state,
        players: players,
        announcementText,
        winner
    };
}

function undoDart(state) {
    document.getElementById("audio_undo").play();
    let players = state.players;

    let currentTurnInfo = getTurnInformation(players, state.score, state.checkInMode, state.checkOutMode).turnInformation.current;
    if (currentTurnInfo.playerIndex === 0 && currentTurnInfo.aufnahmeIndex === 0 && currentTurnInfo.dartIndex === 0) {
        return state;
    }
    if (currentTurnInfo.dartIndex === 0) {
        players[currentTurnInfo.playerIndex].aufnahmen.splice(currentTurnInfo.aufnahmeIndex, 1);
    }

    let previousTurnInfo = getTurnInformation(players, state.score, state.checkInMode, state.checkOutMode).turnInformation.previous;
    players[previousTurnInfo.playerIndex].aufnahmen[previousTurnInfo.aufnahmeIndex].splice(previousTurnInfo.dartIndex, 1);

    return {
        ...state,
        players: players,
        announcementText: undefined,
        winner: undefined
    };
}

export default game