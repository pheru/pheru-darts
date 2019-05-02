package de.pheru.darts.backend.mappers;

import de.pheru.darts.backend.dtos.game.CheckInDto;
import de.pheru.darts.backend.dtos.game.CheckOutDto;
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
        if (dto.getCheckInModes() != null && !dto.getCheckInModes().isEmpty()) {
            filter.setCheckInModes(new ArrayList<>());
            for (final CheckInDto checkInDto : dto.getCheckInModes()) {
                filter.getCheckInModes().add(CheckInMode.forString(checkInDto.getKey()));
            }
        }
        if (dto.getCheckOutModes() != null && !dto.getCheckOutModes().isEmpty()) {
            filter.setCheckOutModes(new ArrayList<>());
            for (final CheckOutDto checkOutDto : dto.getCheckOutModes()) {
                filter.getCheckOutModes().add(CheckOutMode.forString(checkOutDto.getKey()));
            }
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
        if (dto.getStartDate() != null) {
            filter.setStartDate(dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            filter.setEndDate(dto.getEndDate());
        }
        return filter;
    }
}