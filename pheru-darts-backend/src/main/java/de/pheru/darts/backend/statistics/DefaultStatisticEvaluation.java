package de.pheru.darts.backend.statistics;

import de.pheru.darts.backend.entities.game.*;
import de.pheru.darts.backend.security.SecurityUtil;
import de.pheru.darts.backend.util.ReservedUser;

import java.util.*;

public class DefaultStatisticEvaluation implements StatisticEvaluation {

    private static final long MILLIS_PER_DAY = 86400000L;
    private static final int HIGHEST_AUFNAHMEN_COUNT = 5;

    @Override
    public Statistic evaluate(final List<GameEntity> games, final StatisticFilter filter) {
        final List<GameEntity> sortedGames = new ArrayList<>(games);
        sortedGames.sort(Comparator.comparing(GameEntity::getTimestamp));
        final EvaluationState evaluationState = new EvaluationState();
        final Statistic statistic = new Statistic();
        for (final GameEntity game : sortedGames) {
            evaluationState.currentGameNumber++;
            if (gameInFilter(filter, game)) {
                evaluateGame(game, statistic, evaluationState, filter);
            }
        }
        statistic.getAufnahmen().setHighestAufnahmen(evaluationState.highestAufnahmenCounts);
        if (evaluationState.aufnahmeCount > 0) {
            statistic.getAufnahmen().setAverageAufnahmeScore((double) evaluationState.aufnahmeScoreSum / evaluationState.aufnahmeCount);
        } else {
            statistic.getAufnahmen().setAverageAufnahmeScore(0.0);
        }
        return statistic;
    }

    private void evaluateGame(final GameEntity game, final Statistic statistic, final EvaluationState evaluationState,
                              final StatisticFilter filter) {
        evaluationState.currentGameState = new EvaluationGameState(game);
        final GameStatistic gameStatistic = statistic.getGames();
        // Statistik für aktuellen User
        for (final PlayerDocument player : game.getPlayers()) {
            if (player.getId() != null && player.getId().equals(SecurityUtil.getLoggedInUserId())) {
                evaluatePlayer(player, statistic, evaluationState, filter);
            }
        }
        // Jetzt steht im GameState fest, ob Spiel gewonnen oder verloren,
        // also kann jetzt die Sieg-Statistik gegen die restlichen Spieler gesetzt werden
        for (final PlayerDocument player : game.getPlayers()) {
            final String playerIdNotNull = getPlayerIdNotNull(player.getId());
            if (!playerIdNotNull.equals(SecurityUtil.getLoggedInUserId())) {
                final Map<String, GameCountStatistic> gameCountsPerPlayerId = gameStatistic.getCountsPerPlayerIds();
                gameCountsPerPlayerId.putIfAbsent(playerIdNotNull, new GameCountStatistic());
                final GameCountStatistic gameCountStatistic = gameCountsPerPlayerId.get(playerIdNotNull);
                if (evaluationState.currentGameState.won) {
                    gameCountStatistic.setWonCount(gameCountStatistic.getWonCount() + 1);
                } else {
                    gameCountStatistic.setLostCount(gameCountStatistic.getLostCount() + 1);
                }
            }
        }
        if (!evaluationState.currentGameState.training) {
            if (evaluationState.currentGameState.won) {
                gameStatistic.setWonCount(gameStatistic.getWonCount() + 1);
            } else {
                gameStatistic.setLostCount(gameStatistic.getLostCount() + 1);
            }
        }
        if (evaluationState.currentGameState.aufnahmeCount > 0) {
            final StatisticGameInformation gameInformation = new StatisticGameInformation();
            gameInformation.setGameNumber(evaluationState.currentGameNumber);
            gameInformation.setId(game.getId());
            gameInformation.setTimestamp(game.getTimestamp());
            gameInformation.setOpponentIds(new ArrayList<>());
            for (final PlayerDocument player : game.getPlayers()) {
                final String playerIdNotNull = getPlayerIdNotNull(player.getId());
                if (!playerIdNotNull.equals(SecurityUtil.getLoggedInUserId())) {
                    gameInformation.getOpponentIds().add(playerIdNotNull);
                }
            }
            final ProgressStatistic progressStatistic = new ProgressStatistic();
            progressStatistic.setGameInformation(gameInformation);
            progressStatistic.setAverageAufnahmeScore((double) evaluationState.aufnahmeScoreSum
                    / evaluationState.aufnahmeCount);
            progressStatistic.setAverageAufnahmeScoreCurrentGame(
                    (double) evaluationState.currentGameState.aufnahmeScoreSum
                            / evaluationState.currentGameState.aufnahmeCount);
            statistic.getProgress().add(progressStatistic);
        }
    }

    private void evaluatePlayer(final PlayerDocument player, final Statistic statistic, final EvaluationState evaluationState, final StatisticFilter filter) {
        for (final AufnahmeDocument aufnahme : player.getAufnahmen()) {
            evaluateAufnahme(aufnahme, statistic, evaluationState, filter);
        }
    }

    private void evaluateAufnahme(final AufnahmeDocument aufnahme, final Statistic statistic,
                                  final EvaluationState evaluationState, final StatisticFilter filter) {
        evaluationState.currentGameState.lastAufnahmeScore = evaluationState.currentGameState.currentScore;
        final boolean countAufnahmeForStatistic = currentScoreInFilter(filter, evaluationState.currentGameState.currentScore);
        for (final DartDocument dart : aufnahme.getDarts()) {
            evaluateDart(dart, statistic, evaluationState, filter);
        }
        if (countAufnahmeForStatistic) {
            evaluationState.aufnahmeCount++;
            evaluationState.currentGameState.aufnahmeCount++;

            final int aufnahmeScore = evaluationState.currentGameState.lastAufnahmeScore
                    - evaluationState.currentGameState.currentScore;
            evaluationState.aufnahmeScoreSum += aufnahmeScore;
            evaluationState.currentGameState.aufnahmeScoreSum += aufnahmeScore;

            final Map<Integer, Integer> highestAufnahmenCounts = evaluationState.highestAufnahmenCounts;
            if (highestAufnahmenCounts.containsKey(aufnahmeScore)) {
                highestAufnahmenCounts.put(aufnahmeScore, highestAufnahmenCounts.get(aufnahmeScore) + 1);
            } else if (highestAufnahmenCounts.keySet().size() < HIGHEST_AUFNAHMEN_COUNT) {
                highestAufnahmenCounts.put(aufnahmeScore, 1);
            } else {
                final int smallestHighestAufnahmeScore = Collections.min(highestAufnahmenCounts.keySet());
                if (smallestHighestAufnahmeScore < aufnahmeScore) {
                    highestAufnahmenCounts.remove(smallestHighestAufnahmeScore);
                    highestAufnahmenCounts.put(aufnahmeScore, 1);
                }
            }
        }
    }

    private void evaluateDart(final DartDocument dart, final Statistic statistic,
                              final EvaluationState evaluationState, final StatisticFilter filter) {
        final EvaluationGameState gameState = evaluationState.currentGameState;
        final boolean countDartForStatistic = currentScoreInFilter(filter, gameState.currentScore);

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

        final CheckOutMode checkOutMode = gameState.checkOutMode;
        final CheckInMode checkInMode = gameState.checkInMode;
        final int dartScore = dart.getValue() * dart.getMultiplier();

        if (countDartForStatistic && checkOutPossible(checkOutMode, gameState.currentScore)) {
            dartStatistic.setPossibleCheckoutCount(dartStatistic.getPossibleCheckoutCount() + 1);
        }

        final boolean checkOutCondition = checkOutMode == CheckOutMode.SINGLE_OUT
                || (checkOutMode == CheckOutMode.DOUBLE_OUT && dart.getMultiplier() == 2)
                || (checkOutMode == CheckOutMode.MASTER_OUT && (dart.getMultiplier() == 2 || dart.getMultiplier() == 3));
        final boolean thrownOver = isThrownOver(gameState.currentScore, dartScore, checkOutMode);
        if (!gameState.checkInCondition) {
            if (countDartForStatistic) {
                dartStatistic.setPossibleCheckinCount(dartStatistic.getPossibleCheckinCount() + 1);
            }
            gameState.checkInCondition = checkInMode == CheckInMode.SINGLE_IN
                    || (checkInMode == CheckInMode.DOUBLE_IN && dart.getMultiplier() == 2);
            if (countDartForStatistic && gameState.checkInCondition) {
                dartStatistic.setCheckinCount(dartStatistic.getCheckinCount() + 1);
            }
        }
        if (gameState.checkInCondition) {
            if (gameState.currentScore - dartScore == 0 && checkOutCondition) { // ausgecheckt
                gameState.currentScore = 0;
                gameState.won = true;
                if (countDartForStatistic) {
                    dartStatistic.setCheckoutCount(dartStatistic.getCheckoutCount() + 1);
                }
            } else if (thrownOver) { // ueberworfen
                gameState.currentScore = gameState.lastAufnahmeScore;
            } else {
                gameState.currentScore -= dartScore;
            }
        }
    }

    private boolean checkOutPossible(final CheckOutMode checkOutMode, final int score) {
        switch (checkOutMode) {
            case SINGLE_OUT:
                return score <= 20
                        || score == 25
                        || score == 50
                        || (score <= 40 && score % 2 == 0)
                        || (score <= 60 && score % 3 == 0);
            case DOUBLE_OUT:
                return score == 50
                        || (score <= 40 && score % 2 == 0);
            case MASTER_OUT:
                return score == 50
                        || (score <= 40 && score % 2 == 0)
                        || (score <= 60 && score % 3 == 0);
            default:
                throw new IllegalArgumentException("Missing configuration for Checkout-Mode: " + checkOutMode);
        }
    }

    private boolean isThrownOver(final int score, final int dartScore, final CheckOutMode checkOutMode) {
        return score - dartScore <= (checkOutMode == CheckOutMode.SINGLE_OUT ? 0 : 1);
    }

    private boolean containsFilterUserId(final GameEntity game, final StatisticFilter filter) {
        if (game.isTrainingOrDefault() && filter.getUserIds().contains(ReservedUser.TRAINING.getId())) {
            return true;
        }
        for (final PlayerDocument player : game.getPlayers()) {
            if ((player.getId() == null && filter.getUserIds().contains(ReservedUser.UNREGISTERED_USER.getId()))
                    || (player.getId() != null && filter.getUserIds().contains(player.getId()))) {
                return true;
            }
        }
        return false;
    }

    private boolean gameInFilter(final StatisticFilter filter, final GameEntity gameEntity) {
        if (filter == null) {
            return true;
        }
        if (filter.getStartScore() != null
                && filter.getStartScoreComparatorOperator() != null
                && !filter.getStartScoreComparatorOperator().getComparativeMatcher()
                .match(gameEntity.getScore(), filter.getStartScore())) {
            return false;
        }
        if (filter.getCheckOutModes() != null
                && !filter.getCheckOutModes().contains(gameEntity.getCheckOutMode())) {
            return false;
        }
        if (filter.getCheckInModes() != null
                && !filter.getCheckInModes().contains(gameEntity.getCheckInModeOrDefault())) {
            return false;
        }
        if ((filter.getStartDate() != null && filter.getStartDate() > gameEntity.getTimestamp())
                || filter.getEndDate() != null && (filter.getEndDate() + MILLIS_PER_DAY) < gameEntity.getTimestamp()) {
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
    }

    private boolean currentScoreInFilter(final StatisticFilter filter, final long currentScore) {
        return filter == null
                || filter.getCurrentScore() == null
                || filter.getCurrentScoreComparativeOperator() == null
                || filter.getCurrentScoreComparativeOperator().getComparativeMatcher()
                .match(currentScore, filter.getCurrentScore());
    }

    private String getPlayerIdNotNull(final String playerid) {
        return playerid != null ? playerid : ReservedUser.UNREGISTERED_USER.getId();
    }

    private class EvaluationState {
        private long currentGameNumber = 0L;
        private EvaluationGameState currentGameState;
        private long aufnahmeScoreSum = 0L;
        private int aufnahmeCount = 0;
        private final Map<Integer, Integer> highestAufnahmenCounts = new HashMap<>();
    }

    private class EvaluationGameState {
        private final boolean training;
        private final CheckInMode checkInMode;
        private final CheckOutMode checkOutMode;
        private boolean checkInCondition;
        private int currentScore;
        private int lastAufnahmeScore;
        private boolean won;
        private long aufnahmeScoreSum;
        private int aufnahmeCount;

        private EvaluationGameState(final GameEntity game) {
            this.training = game.isTrainingOrDefault();
            this.checkInMode = game.getCheckInModeOrDefault();
            this.checkOutMode = game.getCheckOutMode();

            this.checkInCondition = false;
            this.currentScore = game.getScore();
            this.lastAufnahmeScore = game.getScore();
            this.won = false;
            this.aufnahmeScoreSum = 0L;
            this.aufnahmeCount = 0;
        }
    }
}