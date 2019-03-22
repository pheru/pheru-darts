package de.pheru.darts.backend.mappers;

import de.pheru.darts.backend.dtos.statistics.*;
import de.pheru.darts.backend.statistics.*;

import java.util.HashMap;
import java.util.Map;

public final class ModelToDtoMapper {

    private ModelToDtoMapper() {
        //Utility-Klasse
    }

    public static StatisticDto toStatisticDto(final Statistic statistic, final Map<String, String> playerIdToPlayerName) {
        final StatisticDto statisticDto = new StatisticDto();
        statisticDto.setGames(toGameStatisticDto(statistic.getGames(), playerIdToPlayerName));
        statisticDto.setDarts(toDartStatisticDto(statistic.getDarts()));
        statisticDto.setAufnahmen(toAufnahmenStatisticDto(statistic.getAufnahmen()));
        return statisticDto;
    }

    private static GameStatisticDto toGameStatisticDto(final GameStatistic gameStatistic, final Map<String, String> playerIdToPlayerName) {
        final GameStatisticDto gameStatisticDto = new GameStatisticDto();
        gameStatisticDto.setCountsPerPlayer(toGameCountStatisticDtos(gameStatistic.getCountsPerPlayerIds(), playerIdToPlayerName));
        gameStatisticDto.setWonCount(gameStatistic.getWonCount());
        gameStatisticDto.setLostCount(gameStatistic.getLostCount());
        return gameStatisticDto;
    }

    private static Map<String, GameCountStatisticDto> toGameCountStatisticDtos(
            final Map<String, GameCountStatistic> gameCountStatistics, final Map<String, String> playerIdToPlayerName) {
        final Map<String, GameCountStatisticDto> gameCountStatisticDtos = new HashMap<>();
        for (final Map.Entry<String, GameCountStatistic> entry : gameCountStatistics.entrySet()) {
            final String playerName = playerIdToPlayerName.get(entry.getKey());
            if (gameCountStatisticDtos.containsKey(playerName)) {
                final GameCountStatisticDto existing = gameCountStatisticDtos.get(playerName);
                existing.setWonCount(existing.getWonCount() + entry.getValue().getWonCount());
                existing.setLostCount(existing.getLostCount() + entry.getValue().getLostCount());
            } else {
                final GameCountStatisticDto gameCountStatisticDto = new GameCountStatisticDto();
                gameCountStatisticDto.setWonCount(entry.getValue().getWonCount());
                gameCountStatisticDto.setLostCount(entry.getValue().getLostCount());
                gameCountStatisticDtos.put(playerName, gameCountStatisticDto);
            }
        }
        return gameCountStatisticDtos;
    }

    private static DartStatisticDto toDartStatisticDto(final DartStatistic dartStatistic) {
        final DartStatisticDto dartStatisticDto = new DartStatisticDto();
        dartStatisticDto.setCheckinCount(dartStatistic.getCheckinCount());
        dartStatisticDto.setCheckoutCount(dartStatistic.getCheckoutCount());
        dartStatisticDto.setCountsPerScore(toDartCountStatisticDtos(dartStatistic.getCountsPerScore()));
        dartStatisticDto.setPossibleCheckinCount(dartStatistic.getPossibleCheckinCount());
        dartStatisticDto.setPossibleCheckoutCount(dartStatistic.getPossibleCheckoutCount());
        dartStatisticDto.setTotalCount(dartStatistic.getTotalCount());
        return dartStatisticDto;
    }

    private static Map<Integer, DartCountStatisticDto> toDartCountStatisticDtos(
            final Map<Integer, DartCountStatistic> dartCountStatistics) {
        final Map<Integer, DartCountStatisticDto> gameCountStatisticDtos = new HashMap<>();
        for (final Map.Entry<Integer, DartCountStatistic> entry : dartCountStatistics.entrySet()) {
            final DartCountStatisticDto dartCountStatisticDto = new DartCountStatisticDto();
            dartCountStatisticDto.setSingleCount(entry.getValue().getSingleCount());
            dartCountStatisticDto.setDoubleCount(entry.getValue().getDoubleCount());
            dartCountStatisticDto.setTripleCount(entry.getValue().getTripleCount());
            gameCountStatisticDtos.put(entry.getKey(), dartCountStatisticDto);
        }
        return gameCountStatisticDtos;
    }

    private static AufnahmenStatisticDto toAufnahmenStatisticDto(final AufnahmeStatistic aufnahmeStatistic) {
        final AufnahmenStatisticDto aufnahmenStatisticDto = new AufnahmenStatisticDto();
        aufnahmenStatisticDto.setAverageAufnahmeScore(aufnahmeStatistic.getAverageAufnahmeScore());
        aufnahmenStatisticDto.setHighestAufnahmen(aufnahmeStatistic.getHighestAufnahmen());
        return aufnahmenStatisticDto;
    }

}