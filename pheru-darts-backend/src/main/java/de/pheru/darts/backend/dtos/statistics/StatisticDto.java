package de.pheru.darts.backend.dtos.statistics;

public class StatisticDto {

    private GameStatisticDto games;
    private DartStatisticDto darts;
    private AufnahmenStatisticDto aufnahmen;

    public GameStatisticDto getGames() {
        return games;
    }

    public void setGames(final GameStatisticDto games) {
        this.games = games;
    }

    public DartStatisticDto getDarts() {
        return darts;
    }

    public void setDarts(final DartStatisticDto darts) {
        this.darts = darts;
    }

    public AufnahmenStatisticDto getAufnahmen() {
        return aufnahmen;
    }

    public void setAufnahmen(final AufnahmenStatisticDto aufnahmen) {
        this.aufnahmen = aufnahmen;
    }
}