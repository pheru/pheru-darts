package de.pheru.darts.backend.statistics;

import de.pheru.darts.backend.entities.game.CheckInMode;
import de.pheru.darts.backend.entities.game.CheckOutMode;
import de.pheru.darts.backend.util.ComparativeOperator;

import java.util.List;

public class StatisticFilter {

    private List<String> gameIds;
    private List<String> userIds;
    private CheckInMode checkInMode;
    private CheckOutMode checkOutMode;
    private Integer startScore;
    private ComparativeOperator startScoreComparatorOperator;
    private Integer currentScore;
    private ComparativeOperator currentScoreComparativeOperator;
    private Long date;
    private ComparativeOperator dateComparativeOperator;

    public List<String> getGameIds() {
        return gameIds;
    }

    public void setGameIds(final List<String> gameIds) {
        this.gameIds = gameIds;
    }

    public List<String> getUserIds() {
        return userIds;
    }

    public void setUserIds(final List<String> userIds) {
        this.userIds = userIds;
    }

    public CheckInMode getCheckInMode() {
        return checkInMode;
    }

    public void setCheckInMode(final CheckInMode checkInMode) {
        this.checkInMode = checkInMode;
    }

    public CheckOutMode getCheckOutMode() {
        return checkOutMode;
    }

    public void setCheckOutMode(final CheckOutMode checkOutMode) {
        this.checkOutMode = checkOutMode;
    }

    public Integer getStartScore() {
        return startScore;
    }

    public void setStartScore(final Integer startScore) {
        this.startScore = startScore;
    }

    public ComparativeOperator getStartScoreComparatorOperator() {
        return startScoreComparatorOperator;
    }

    public void setStartScoreComparatorOperator(final ComparativeOperator startScoreComparatorOperator) {
        this.startScoreComparatorOperator = startScoreComparatorOperator;
    }

    public Integer getCurrentScore() {
        return currentScore;
    }

    public void setCurrentScore(final Integer currentScore) {
        this.currentScore = currentScore;
    }

    public ComparativeOperator getCurrentScoreComparativeOperator() {
        return currentScoreComparativeOperator;
    }

    public void setCurrentScoreComparativeOperator(final ComparativeOperator currentScoreComparativeOperator) {
        this.currentScoreComparativeOperator = currentScoreComparativeOperator;
    }

    public Long getDate() {
        return date;
    }

    public void setDate(final Long date) {
        this.date = date;
    }

    public ComparativeOperator getDateComparativeOperator() {
        return dateComparativeOperator;
    }

    public void setDateComparativeOperator(final ComparativeOperator dateComparativeOperator) {
        this.dateComparativeOperator = dateComparativeOperator;
    }

}