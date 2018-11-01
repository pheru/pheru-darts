package de.pheru.darts.backend.dtos.statistics;

import java.util.HashMap;
import java.util.Map;

public class DartStatisticDto {

    private Long totalCount = 0L;
    private Map<Integer, DartCountStatisticDto> countsPerScore = new HashMap<>();
    private Long possibleCheckoutCount = 0L;
    private Long checkoutCount = 0L;

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

    public Long getPossibleCheckoutCount() {
        return possibleCheckoutCount;
    }

    public void setPossibleCheckoutCount(final Long possibleCheckoutCount) {
        this.possibleCheckoutCount = possibleCheckoutCount;
    }

    public Long getCheckoutCount() {
        return checkoutCount;
    }

    public void setCheckoutCount(final Long checkoutCount) {
        this.checkoutCount = checkoutCount;
    }
}
