package de.pheru.darts.backend.dtos.statistics;

public class ProgressStatisticDto {

    private StatisticGameInformationDto gameInformation;
    private double averageAufnahmeScore = 0.0;
    private double averageAufnahmeScoreCurrentGame = 0.0;

    public StatisticGameInformationDto getGameInformation() {
        return gameInformation;
    }

    public void setGameInformation(final StatisticGameInformationDto gameInformation) {
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