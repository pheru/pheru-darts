package de.pheru.darts.backend.statistics;

import java.util.List;

public class StatisticGameInformation {

    private String id;
    private List<String> opponentIds;
    private long timestamp;

    public String getId() {
        return id;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public List<String> getOpponentIds() {
        return opponentIds;
    }

    public void setOpponentIds(final List<String> opponentIds) {
        this.opponentIds = opponentIds;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(final long timestamp) {
        this.timestamp = timestamp;
    }
}