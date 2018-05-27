export const START_NEW_GAME = 'START_NEW_GAME';

export const startNewGame = (players, score, checkOutMode) => ({
    type: START_NEW_GAME,
    players,
    score,
    checkOutMode
});

