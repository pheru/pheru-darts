import {ADD_DART, EXIT_GAME, REMATCH, START_NEW_GAME, UNDO_DART} from "../actions/game";
import getTurnInformation from "../services/gameInformationService";

function game(state = null, action) {
    switch (action.type) {
        case START_NEW_GAME:
            let players = action.players;
            initPlayers(players);
            return {
                ...state,
                players: players,
                score: action.score,
                checkOutMode: action.checkOutMode
            };
        case ADD_DART:
            return addDart(state, {value: action.value, multiplier: action.multiplier});
        case UNDO_DART:
            return undoDart(state);
        case EXIT_GAME:
            return null;
        case REMATCH:
            let playersCopy = state.players.slice();
            playersCopy.push(playersCopy.shift());
            initPlayers(playersCopy);
            return {
                ...state,
                players: playersCopy
            };
        default:
            return state
    }
}

function initPlayers(players){
    for (let i = 0; i < players.length; i++) {
        players[i].aufnahmen = [];
    }
    players[0].aufnahmen[0] = [];
}

function addDart(state, dart) {
    let multiplier = dart.multiplier;
    if ((dart.value === 0 && multiplier !== 1) || (dart.value === 25 && multiplier > 2)) {
        alert("multiplier auf 1 korrigiert, da Dart ungültig: " + JSON.stringify(dart));
        multiplier = 1;
    }
    let validatedDart = {...dart, multiplier};
    let players = state.players;

    let currentTurnInfo = getTurnInformation(players, state.score, state.checkOutMode).turnInformation.current;

    players[currentTurnInfo.playerIndex].aufnahmen[currentTurnInfo.aufnahmeIndex][currentTurnInfo.dartIndex] = validatedDart;

    let turnInfo = getTurnInformation(players, state.score, state.checkOutMode);
    currentTurnInfo = turnInfo.turnInformation.current;
    if (players[currentTurnInfo.playerIndex].aufnahmen[currentTurnInfo.aufnahmeIndex] === undefined) {
        players[currentTurnInfo.playerIndex].aufnahmen[currentTurnInfo.aufnahmeIndex] = [];
    }
    return {
        ...state,
        players: players,
    };
}

function undoDart(state) {
    let players = state.players;

    let currentTurnInfo = getTurnInformation(players, state.score, state.checkOutMode).turnInformation.current;
    if (currentTurnInfo.playerIndex === 0 && currentTurnInfo.aufnahmeIndex === 0 && currentTurnInfo.dartIndex === 0) {
        alert("Rückgängig beim ersten Wurf nicht möglich!");
        return state;
    }
    if (currentTurnInfo.dartIndex === 0) {
        players[currentTurnInfo.playerIndex].aufnahmen.splice(currentTurnInfo.aufnahmeIndex, 1);
    }

    let previousTurnInfo = getTurnInformation(players, state.score, state.checkOutMode).turnInformation.previous;
    players[previousTurnInfo.playerIndex].aufnahmen[previousTurnInfo.aufnahmeIndex].splice(previousTurnInfo.dartIndex, 1);

    return {
        ...state,
        players: players,
    };
}

export default game
