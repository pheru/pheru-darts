package de.pheru.darts.backend.statistics;

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

}