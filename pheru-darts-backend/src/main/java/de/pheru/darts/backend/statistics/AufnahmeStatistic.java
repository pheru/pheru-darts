package de.pheru.darts.backend.statistics;

import java.util.HashMap;
import java.util.Map;

public class AufnahmeStatistic {

    private Map<Integer, Integer> highestAufnahmen = new HashMap<>();
    private Double averageAufnahmeScore = 0.0;

    public Map<Integer, Integer> getHighestAufnahmen() {
        return highestAufnahmen;
    }

    public void setHighestAufnahmen(final Map<Integer, Integer> highestAufnahmen) {
        this.highestAufnahmen = highestAufnahmen;
    }

    public Double getAverageAufnahmeScore() {
        return averageAufnahmeScore;
    }

    public void setAverageAufnahmeScore(final Double averageAufnahmeScore) {
        this.averageAufnahmeScore = averageAufnahmeScore;
    }
}