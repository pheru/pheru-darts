package de.pheru.darts.backend.dtos.statistics;

import de.pheru.darts.backend.dtos.game.CheckInDto;
import de.pheru.darts.backend.dtos.game.CheckOutDto;

import java.util.List;

public class StatisticFilterDto {

    private List<String> gameIds;
    private List<String> userIds;
    private CheckInDto checkInMode;
    private CheckOutDto checkOutMode;
    private Integer startScore;
    private String startScoreComparativeOperator;
    private Integer currentScore;
    private String currentScoreComparativeOperator;
    private Long startDate;
    private Long endDate;

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

    public CheckInDto getCheckInMode() {
        return checkInMode;
    }

    public void setCheckInMode(final CheckInDto checkInMode) {
        this.checkInMode = checkInMode;
    }

    public CheckOutDto getCheckOutMode() {
        return checkOutMode;
    }

    public void setCheckOutMode(final CheckOutDto checkOutMode) {
        this.checkOutMode = checkOutMode;
    }

    public Integer getStartScore() {
        return startScore;
    }

    public void setStartScore(final Integer startScore) {
        this.startScore = startScore;
    }

    public String getStartScoreComparativeOperator() {
        return startScoreComparativeOperator;
    }

    public void setStartScoreComparativeOperator(final String startScoreComparativeOperator) {
        this.startScoreComparativeOperator = startScoreComparativeOperator;
    }

    public Integer getCurrentScore() {
        return currentScore;
    }

    public void setCurrentScore(final Integer currentScore) {
        this.currentScore = currentScore;
    }

    public String getCurrentScoreComparativeOperator() {
        return currentScoreComparativeOperator;
    }

    public void setCurrentScoreComparativeOperator(final String currentScoreComparativeOperator) {
        this.currentScoreComparativeOperator = currentScoreComparativeOperator;
    }

    public Long getStartDate() {
        return startDate;
    }

    public void setStartDate(final Long startDate) {
        this.startDate = startDate;
    }

    public Long getEndDate() {
        return endDate;
    }

    public void setEndDate(final Long endDate) {
        this.endDate = endDate;
    }

}