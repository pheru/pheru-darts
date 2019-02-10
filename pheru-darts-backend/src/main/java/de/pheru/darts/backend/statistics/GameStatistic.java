package de.pheru.darts.backend.statistics;

import java.util.HashMap;
import java.util.Map;

public class GameStatistic {

    private Long wonCount = 0L;
    private Long lostCount = 0L;
    private Map<String, GameCountStatistic> countsPerPlayerIds = new HashMap<>();

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

    public Map<String, GameCountStatistic> getCountsPerPlayerIds() {
        return countsPerPlayerIds;
    }

    public void setCountsPerPlayerIds(final Map<String, GameCountStatistic> countsPerPlayerIds) {
        this.countsPerPlayerIds = countsPerPlayerIds;
    }
}