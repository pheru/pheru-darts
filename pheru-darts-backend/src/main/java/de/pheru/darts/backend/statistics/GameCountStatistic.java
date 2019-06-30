package de.pheru.darts.backend.statistics;

public class GameCountStatistic {

    private Long wonCount = 0L;
    private Long lostCount = 0L;

    public Long getWonCount() {
        return wonCount;
    }

    public void setWonCount(final Long wonCount) {
        this.wonCount = wonCount;
    }

    public Long getLostCount() {
        return lostCount;
    }

    public void setLostCount(final Long lostCount) {
        this.lostCount = lostCount;
    }
}