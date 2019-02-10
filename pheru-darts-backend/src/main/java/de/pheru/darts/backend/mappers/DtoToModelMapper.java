package de.pheru.darts.backend.mappers;

import de.pheru.darts.backend.dtos.statistics.StatisticFilterDto;
import de.pheru.darts.backend.entities.game.CheckInMode;
import de.pheru.darts.backend.entities.game.CheckOutMode;
import de.pheru.darts.backend.statistics.StatisticFilter;
import de.pheru.darts.backend.util.ComparativeOperator;

import java.util.ArrayList;

public final class DtoToModelMapper {

    private DtoToModelMapper() {
        //Utility-Klasse
    }

    public static StatisticFilter toStatisticFilter(final StatisticFilterDto dto) {
        if (dto == null) {
            return null;
        }

        final StatisticFilter filter = new StatisticFilter();
        if (dto.getUserIds() != null && !dto.getUserIds().isEmpty()) {
            filter.setUserIds(new ArrayList<>(dto.getUserIds()));
        }
        if (dto.getGameIds() != null && !dto.getGameIds().isEmpty()) {
            filter.setGameIds(new ArrayList<>(dto.getGameIds()));
        }
        if (dto.getCheckInMode() != null) {
            filter.setCheckInMode(CheckInMode.forString(dto.getCheckInMode().getKey()));
        }
        if (dto.getCheckOutMode() != null) {
            filter.setCheckOutMode(CheckOutMode.forString(dto.getCheckOutMode().getKey()));
        }
        if (dto.getStartScore() != null) {
            filter.setStartScore(dto.getStartScore());
        }
        if (dto.getStartScoreComparativeOperator() != null) {
            filter.setStartScoreComparatorOperator(
                    ComparativeOperator.forString(dto.getStartScoreComparativeOperator()));
        }
        if (dto.getCurrentScore() != null) {
            filter.setCurrentScore(dto.getCurrentScore());
        }
        if (dto.getCurrentScoreComparativeOperator() != null) {
            filter.setCurrentScoreComparativeOperator(
                    ComparativeOperator.forString(dto.getCurrentScoreComparativeOperator()));
        }
        if (dto.getDate() != null) {
            filter.setDate(dto.getDate());
        }
        if (dto.getDateComparativeOperator() != null) {
            filter.setDateComparativeOperator(
                    ComparativeOperator.forString(dto.getDateComparativeOperator()));
        }
        return filter;
    }

}
