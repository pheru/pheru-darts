package de.pheru.darts.backend.dtos.statistics;

import java.util.List;

public class StatisticGameInformationDto {

    private String id;
    private long gameNumber;
    private List<String> opponents;
    private long timestamp;

    public String getId() {
        return id;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public long getGameNumber() {
        return gameNumber;
    }

    public void setGameNumber(final long gameNumber) {
        this.gameNumber = gameNumber;
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