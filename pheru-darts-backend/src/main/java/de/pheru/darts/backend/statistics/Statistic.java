package de.pheru.darts.backend.statistics;

public class Statistic {

    private GameStatistic games = new GameStatistic();
    private DartStatistic darts = new DartStatistic();
    private AufnahmeStatistic aufnahmen = new AufnahmeStatistic();

    public GameStatistic getGames() {
        return games;
    }

    public void setGames(final GameStatistic games) {
        this.games = games;
    }

    public DartStatistic getDarts() {
        return darts;
    }

    public void setDarts(final DartStatistic darts) {
        this.darts = darts;
    }

    public AufnahmeStatistic getAufnahmen() {
        return aufnahmen;
    }

    public void setAufnahmen(final AufnahmeStatistic aufnahmen) {
        this.aufnahmen = aufnahmen;
    }
}