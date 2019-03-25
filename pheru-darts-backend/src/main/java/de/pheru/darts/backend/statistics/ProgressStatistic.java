package de.pheru.darts.backend.statistics;

import java.util.Objects;

public class ProgressStatistic {

    private StatisticGameInformation gameInformation;
    private double averageAufnahmeScore = 0.0;
    private double averageAufnahmeScoreCurrentGame = 0.0;

    public StatisticGameInformation getGameInformation() {
        return gameInformation;
    }

    public void setGameInformation(final StatisticGameInformation gameInformation) {
        this.gameInformation = gameInformation;
    }

    public double getAverageAufnahmeScore() {
        return averageAufnahmeScore;
    }

    public void setAverageAufnahmeScore(final double averageAufnahmeScore) {
        this.averageAufnahmeScore = averageAufnahmeScore;
    }

    public double getAverageAufnahmeScoreCurrentGame() {
        return averageAufnahmeScoreCurrentGame;
    }

    public void setAverageAufnahmeScoreCurrentGame(final double averageAufnahmeScoreCurrentGame) {
        this.averageAufnahmeScoreCurrentGame = averageAufnahmeScoreCurrentGame;
    }

    public static class Key {

        private final int gameNumber;
        private final long timestamp;

        public Key(final int gameNumber, final long timestamp) {
            this.gameNumber = gameNumber;
            this.timestamp = timestamp;
        }

        public int getGameNumber() {
            return gameNumber;
        }

        public long getTimestamp() {
            return timestamp;
        }

        @Override
        public boolean equals(final Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            final Key key = (Key) o;
            return gameNumber == key.gameNumber;
        }

        @Override
        public int hashCode() {
            return Objects.hash(gameNumber);
        }
    }
}