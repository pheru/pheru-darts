package de.pheru.darts.backend.statistics;

public class DartCountStatistic {

    private Long singleCount = 0L;
    private Long doubleCount = 0L;
    private Long tripleCount = 0L;

    public Long getSingleCount() {
        return singleCount;
    }

    public void setSingleCount(final Long singleCount) {
        this.singleCount = singleCount;
    }

    public Long getDoubleCount() {
        return doubleCount;
    }

    public void setDoubleCount(final Long doubleCount) {
        this.doubleCount = doubleCount;
    }

    public Long getTripleCount() {
        return tripleCount;
    }

    public void setTripleCount(final Long tripleCount) {
        this.tripleCount = tripleCount;
    }
}
