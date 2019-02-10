package de.pheru.darts.backend.statistics;

import de.pheru.darts.backend.entities.game.*;
import de.pheru.darts.backend.security.SecurityUtil;
import de.pheru.darts.backend.util.ReservedUser;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DefaultStatisticEvaluation implements StatisticEvaluation {

    @Override
    public Statistic evaluate(final List<GameEntity> games, final StatisticFilter filter) {
        final Statistic statistic = new Statistic();
        final List<GameEntity> filteredGames = applyFilterToGames(filter, games);
        for (final GameEntity game : filteredGames) {
            evaluateGame(game, statistic, filter);
        }
        return statistic;
    }

    private void evaluateGame(final GameEntity game, final Statistic statistic, final StatisticFilter filter) {
        final EvaluationGameState gameState = new EvaluationGameState(game);
        final GameStatistic gameStatistic = statistic.getGames();
        // Statistik für aktuellen User
        for (final PlayerDocument player : game.getPlayers()) {
            if (player.getId() != null && player.getId().equals(SecurityUtil.getLoggedInUserId())) {
                evaluatePlayer(player, statistic, gameState, filter);
            }
        }
        // Jetzt steht im GameState fest, ob Spiel gewonnen oder verloren,
        // also kann jetzt die Sieg-Statistik gegen die restlichen Spieler gesetzt werden
        for (final PlayerDocument player : game.getPlayers()) {
            final String playerId = player.getId() != null ? player.getId() : ReservedUser.UNREGISTERED_USERS.getId();
            if (!playerId.equals(SecurityUtil.getLoggedInUserId())) {
                final Map<String, GameCountStatistic> gameCountsPerPlayerId = gameStatistic.getCountsPerPlayerIds();
                gameCountsPerPlayerId.putIfAbsent(playerId, new GameCountStatistic());
                final GameCountStatistic gameCountStatistic = gameCountsPerPlayerId.get(playerId);
                if (gameState.isWon()) {
                    gameCountStatistic.setWonCount(gameCountStatistic.getWonCount() + 1);
                } else {
                    gameCountStatistic.setLostCount(gameCountStatistic.getLostCount() + 1);
                }
            }
        }
        if (!gameState.isTraining()) {
            if (gameState.isWon()) {
                gameStatistic.setWonCount(gameStatistic.getWonCount() + 1);
            } else {
                gameStatistic.setLostCount(gameStatistic.getLostCount() + 1);
            }
        }
    }

    private void evaluatePlayer(final PlayerDocument player, final Statistic statistic, final EvaluationGameState gameState, final StatisticFilter filter) {
        for (final AufnahmeDocument aufnahme : player.getAufnahmen()) {
            evaluateAufnahme(aufnahme, statistic, gameState, filter);
        }
    }

    private void evaluateAufnahme(final AufnahmeDocument aufnahme, final Statistic statistic,
                                  final EvaluationGameState gameState, final StatisticFilter filter) {
        gameState.setLastAufnahmeScore(gameState.getCurrentScore());
        for (final DartDocument dart : aufnahme.getDarts()) {
            evaluateDart(dart, statistic, gameState, filter);
        }
    }

    private void evaluateDart(final DartDocument dart, final Statistic statistic,
                              final EvaluationGameState gameState, final StatisticFilter filter) {
        final boolean countDartForStatistic = filter == null
                || filter.getCurrentScore() == null
                || filter.getCurrentScoreComparativeOperator() == null
                || filter.getCurrentScoreComparativeOperator().getComparativeMatcher()
                .match(gameState.getCurrentScore(), filter.getCurrentScore());

        final DartStatistic dartStatistic = statistic.getDarts();
        if (countDartForStatistic) {
            dartStatistic.setTotalCount(dartStatistic.getTotalCount() + 1);
            final Map<Integer, DartCountStatistic> countsPerScore = dartStatistic.getCountsPerScore();
            final int key = dart.getValue();
            countsPerScore.putIfAbsent(key, new DartCountStatistic());
            final DartCountStatistic dartCountStatistic = countsPerScore.get(key);
            if (dart.getMultiplier() == 1) {
                dartCountStatistic.setSingleCount(dartCountStatistic.getSingleCount() + 1);
            } else if (dart.getMultiplier() == 2) {
                dartCountStatistic.setDoubleCount(dartCountStatistic.getDoubleCount() + 1);
            } else if (dart.getMultiplier() == 3) {
                dartCountStatistic.setTripleCount(dartCountStatistic.getTripleCount() + 1);
            }
        }

        final CheckOutMode checkOutMode = gameState.getCheckOutMode();
        final CheckInMode checkInMode = gameState.getCheckInMode();
        final int dartScore = dart.getValue() * dart.getMultiplier();

        if (countDartForStatistic && checkOutPossible(checkOutMode, gameState.getCurrentScore())) {
            dartStatistic.setPossibleCheckoutCount(dartStatistic.getPossibleCheckoutCount() + 1);
        }

        final boolean checkOutCondition = checkOutMode == CheckOutMode.SINGLE_OUT
                || (checkOutMode == CheckOutMode.DOUBLE_OUT && dart.getMultiplier() == 2);
        final boolean thrownOver = isThrownOver(gameState.getCurrentScore(), dartScore, checkOutMode);
        if (!gameState.isCheckInCondition()) {
            if (countDartForStatistic) {
                dartStatistic.setPossibleCheckinCount(dartStatistic.getPossibleCheckinCount() + 1);
            }
            gameState.setCheckInCondition(checkInMode == CheckInMode.SINGLE_IN
                    || (checkInMode == CheckInMode.DOUBLE_IN && dart.getMultiplier() == 2));
            if (countDartForStatistic && gameState.isCheckInCondition()) {
                dartStatistic.setCheckinCount(dartStatistic.getCheckinCount() + 1);
            }
        }
        if (gameState.isCheckInCondition()) {
            if (gameState.getCurrentScore() - dartScore == 0 && checkOutCondition) { // ausgecheckt
                gameState.setCurrentScore(0);
                gameState.setWon(true);
                if (countDartForStatistic) {
                    dartStatistic.setCheckoutCount(dartStatistic.getCheckoutCount() + 1);
                }
            } else if (thrownOver) { // ueberworfen
                gameState.setCurrentScore(gameState.getLastAufnahmeScore());
            } else {
                gameState.setCurrentScore(gameState.getCurrentScore() - dartScore);
            }
        }
    }

    private boolean checkOutPossible(final CheckOutMode checkOutMode, final int score) {
        if (checkOutMode == CheckOutMode.SINGLE_OUT) {
            return score <= 20
                    || score == 25
                    || score == 50
                    || (score <= 40 && score % 2 == 0)
                    || (score <= 60 && score % 3 == 0);
        } else {
            return score == 50
                    || (score <= 40 && score % 2 == 0);
        }
    }

    private boolean isThrownOver(final int score, final int dartScore, final CheckOutMode checkOutMode) {
        return score - dartScore <= (checkOutMode == CheckOutMode.SINGLE_OUT ? 0 : 1);
    }

    private List<GameEntity> applyFilterToGames(final StatisticFilter filter, final List<GameEntity> games) {
        if (filter == null) {
            return games;
        }
        return games.stream()
                .filter(gameEntity -> {
                    if (filter.getStartScore() != null
                            && filter.getStartScoreComparatorOperator() != null
                            && !filter.getStartScoreComparatorOperator().getComparativeMatcher()
                            .match(gameEntity.getScore(), filter.getStartScore())) {
                        return false;
                    }
                    if (filter.getCheckOutMode() != null
                            && gameEntity.getCheckOutMode() != filter.getCheckOutMode()) {
                        return false;
                    }
                    if (filter.getCheckInMode() != null
                            && gameEntity.getCheckInModeOrDefault() != filter.getCheckInMode()) {
                        return false;
                    }
                    if (filter.getDate() != null
                            && filter.getDateComparativeOperator() != null
                            && !filter.getDateComparativeOperator().getComparativeMatcher()
                            .match(removeTimeFromDateMillis(gameEntity.getTimestamp()), filter.getDate())) {
                        return false;
                    }
                    if (filter.getGameIds() != null
                            && !filter.getGameIds().isEmpty()
                            && !filter.getGameIds().contains(gameEntity.getId())) {
                        return false;
                    }
                    if (filter.getUserIds() != null
                            && !filter.getUserIds().isEmpty()
                            && !containsFilterUserId(gameEntity, filter)) {
                        return false;
                    }
                    return true;
                }).collect(Collectors.toList());
    }

    private boolean containsFilterUserId(final GameEntity game, final StatisticFilter filter) {
        for (final PlayerDocument player : game.getPlayers()) {
            for (final String userId : filter.getUserIds()) {
                if (player.getId().equals(userId)) {
                    return true;
                }
            }
        }
        return false;
    }

    private long removeTimeFromDateMillis(final long millis) {
        final Calendar cal = Calendar.getInstance();
        cal.setTime(new Date(millis));
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTimeInMillis();
    }

    private class EvaluationGameState {
        private final boolean training;
        private final CheckInMode checkInMode;
        private final CheckOutMode checkOutMode;
        private boolean checkInCondition;
        private int currentScore;
        private int lastAufnahmeScore;
        private boolean won;

        private EvaluationGameState(final GameEntity game) {
            this.training = game.isTrainingOrDefault();
            this.checkInMode = game.getCheckInModeOrDefault();
            this.checkOutMode = game.getCheckOutMode();

            this.checkInCondition = false;
            this.currentScore = game.getScore();
            this.lastAufnahmeScore = game.getScore();
            this.won = false;
        }

        public boolean isTraining() {
            return training;
        }

        public CheckInMode getCheckInMode() {
            return checkInMode;
        }

        public CheckOutMode getCheckOutMode() {
            return checkOutMode;
        }

        public boolean isCheckInCondition() {
            return checkInCondition;
        }

        public void setCheckInCondition(final boolean checkInCondition) {
            this.checkInCondition = checkInCondition;
        }

        public int getCurrentScore() {
            return currentScore;
        }

        public void setCurrentScore(final int currentScore) {
            this.currentScore = currentScore;
        }

        public int getLastAufnahmeScore() {
            return lastAufnahmeScore;
        }

        public void setLastAufnahmeScore(final int lastAufnahmeScore) {
            this.lastAufnahmeScore = lastAufnahmeScore;
        }

        public boolean isWon() {
            return won;
        }

        public void setWon(final boolean won) {
            this.won = won;
        }
    }

}