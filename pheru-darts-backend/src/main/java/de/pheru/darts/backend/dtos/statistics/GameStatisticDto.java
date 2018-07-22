package de.pheru.darts.backend.dtos.statistics;

import java.util.HashMap;
import java.util.Map;

public class GameStatisticDto {

    private Long wonCount = 0L;
    private Long lostCount = 0L;
    private Map<String, GameCountStatisticDto> countsPerPlayer = new HashMap<>();

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

    public Map<String, GameCountStatisticDto> getCountsPerPlayer() {
        return countsPerPlayer;
    }

    public void setCountsPerPlayer(final Map<String, GameCountStatisticDto> countsPerPlayer) {
        this.countsPerPlayer = countsPerPlayer;
    }
}
