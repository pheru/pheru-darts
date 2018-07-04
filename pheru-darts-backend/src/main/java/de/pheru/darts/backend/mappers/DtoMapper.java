package de.pheru.darts.backend.mappers;

import de.pheru.darts.backend.dtos.DartDto;
import de.pheru.darts.backend.dtos.GameDto;
import de.pheru.darts.backend.dtos.PlayerDto;
import de.pheru.darts.backend.entities.AufnahmeDocument;
import de.pheru.darts.backend.entities.DartDocument;
import de.pheru.darts.backend.entities.GameEntity;
import de.pheru.darts.backend.entities.PlayerDocument;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public final class DtoMapper {

    private DtoMapper() {
        //Utility-Klasse
    }

    public static GameEntity toGameEntity(final GameDto gameDto) {
        final GameEntity gameEntity = new GameEntity();
        gameEntity.setWinnerId(gameDto.getWinner().getId());
        gameEntity.setScore(gameDto.getScore());
        gameEntity.setCheckOutMode(gameDto.getCheckOutMode().getKey());
        gameEntity.setPlayers(toPlayerDocument(Arrays.asList(gameDto.getPlayers())));
        return gameEntity;
    }

    private static List<PlayerDocument> toPlayerDocument(final List<PlayerDto> playerDtos) {
        final List<PlayerDocument> playerDocuments = new ArrayList<>();
        for (final PlayerDto playerDto : playerDtos) {
            playerDocuments.add(toPlayerDocument(playerDto));
        }
        return playerDocuments;
    }

    private static PlayerDocument toPlayerDocument(final PlayerDto playerDto) {
        final PlayerDocument playerDocument = new PlayerDocument();
        playerDocument.setId(playerDto.getId());
        playerDocument.setAufnahmen(toAufnahmeDocument(playerDto.getAufnahmen()));
        return playerDocument;
    }

    private static List<AufnahmeDocument> toAufnahmeDocument(final DartDto[][] aufnahmen) {
        final List<AufnahmeDocument> aufnahmeDocuments = new ArrayList<>();
        for (final DartDto[] aufnahme : aufnahmen) {
            aufnahmeDocuments.add(toAufnahmeDocument(aufnahme));
        }
        return aufnahmeDocuments;
    }

    private static AufnahmeDocument toAufnahmeDocument(final DartDto[] aufnahme) {
        final AufnahmeDocument aufnahmeDocument = new AufnahmeDocument();
        final List<DartDocument> dartDocuments = new ArrayList<>();
        for (final DartDto dartDto : aufnahme) {
            dartDocuments.add(toDartDocument(dartDto));
        }
        aufnahmeDocument.setDarts(dartDocuments);
        return aufnahmeDocument;
    }

    private static DartDocument toDartDocument(final DartDto dartDto) {
        final DartDocument dartDocument = new DartDocument();
        dartDocument.setValue(dartDto.getValue());
        dartDocument.setMultiplier(dartDto.getMultiplier());
        return dartDocument;
    }

}
