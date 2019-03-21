package de.pheru.darts.backend.dtos.statistics;

import java.util.List;

public class StatisticFilterGameOptionDto {

    private String id;
    private List<String> opponents;
    private long timestamp;

    public String getId() {
        return id;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public List<String> getOpponents() {
        return opponents;
    }

    public void setOpponents(final List<String> opponents) {
        this.opponents = opponents;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(final long timestamp) {
        this.timestamp = timestamp;
    }
}