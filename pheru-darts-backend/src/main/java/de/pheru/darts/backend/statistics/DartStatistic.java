package de.pheru.darts.backend.statistics;

import java.util.HashMap;
import java.util.Map;

public class DartStatistic {

    private Long totalCount = 0L;
    private Map<Integer, DartCountStatistic> countsPerScore = new HashMap<>();
    private Long possibleCheckoutCount = 0L;
    private Long checkoutCount = 0L;
    private Long possibleCheckinCount = 0L;
    private Long checkinCount = 0L;

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(final Long totalCount) {
        this.totalCount = totalCount;
    }

    public Map<Integer, DartCountStatistic> getCountsPerScore() {
        return countsPerScore;
    }

    public void setCountsPerScore(final Map<Integer, DartCountStatistic> countsPerScore) {
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

    public Long getPossibleCheckinCount() {
        return possibleCheckinCount;
    }

    public void setPossibleCheckinCount(final Long possibleCheckinCount) {
        this.possibleCheckinCount = possibleCheckinCount;
    }

    public Long getCheckinCount() {
        return checkinCount;
    }

    public void setCheckinCount(final Long checkinCount) {
        this.checkinCount = checkinCount;
    }
}
