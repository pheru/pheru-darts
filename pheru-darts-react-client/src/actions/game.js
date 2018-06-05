export const START_NEW_GAME = 'START_NEW_GAME';
export const ADD_DART = 'ADD_DART';
export const UNDO_DART = 'UNDO_DART';
export const EXIT_GAME = 'EXIT_GAME';
export const REMATCH = 'REMATCH';

export const startNewGame = (players, score, checkOutMode) => ({
    type: START_NEW_GAME,
    players,
    score,
    checkOutMode
});

export const addDart = (value, multiplier) => ({
    type: ADD_DART,
    value,
    multiplier
});

export const undoDart = () => ({
    type: UNDO_DART
});

export const exitGame = () => ({
    type: EXIT_GAME
});

export const rematch = () => ({
    type: REMATCH
});

