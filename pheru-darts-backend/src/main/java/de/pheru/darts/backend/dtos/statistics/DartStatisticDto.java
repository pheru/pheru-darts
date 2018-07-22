package de.pheru.darts.backend.dtos.statistics;

import java.util.HashMap;
import java.util.Map;

public class DartStatisticDto {

    private Long totalCount = 0L;
    private Map<Integer, DartCountStatisticDto> countsPerScore = new HashMap<>();

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(final Long totalCount) {
        this.totalCount = totalCount;
    }

    public Map<Integer, DartCountStatisticDto> getCountsPerScore() {
        return countsPerScore;
    }

    public void setCountsPerScore(final Map<Integer, DartCountStatisticDto> countsPerScore) {
        this.countsPerScore = countsPerScore;
    }
}
