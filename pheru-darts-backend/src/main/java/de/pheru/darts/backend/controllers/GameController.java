package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.DartDto;
import de.pheru.darts.backend.dtos.GameDto;
import de.pheru.darts.backend.dtos.PlayerDto;
import de.pheru.darts.backend.entities.GameEntity;
import de.pheru.darts.backend.exceptions.ForbiddenException;
import de.pheru.darts.backend.mappers.DtoMapper;
import de.pheru.darts.backend.repositories.GameRepository;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Date;

@RestController
@RequestMapping("/game")
public class GameController {

    private static final Logger LOGGER = new Logger();

    private final PlayerPermissionRepository playerPermissionRepository;
    private final GameRepository gameRepository;

    public GameController(final PlayerPermissionRepository playerPermissionRepository,
                          final GameRepository gameRepository) {
        this.playerPermissionRepository = playerPermissionRepository;
        this.gameRepository = gameRepository;
    }

    @PostMapping
    public void postGame(@RequestBody final GameDto game) {
        LOGGER.debug("POST auf /games aufgerufen");

        checkPermissions(game);

        final Date timestamp = new Date();
        for (final PlayerDto playerDto : game.getPlayers()) {
            if (playerDto.getId() == null) {
                continue;
            }
            final DartDto[][] aufnahmen = playerDto.getAufnahmen();
            // Die letzte Aufnahme ist beim Verlierer leer und sollte nicht gespeichert werden
            if (aufnahmen[aufnahmen.length - 1].length == 0) {
                playerDto.setAufnahmen(Arrays.copyOfRange(aufnahmen, 0, aufnahmen.length - 1));
            }
            final GameEntity gameEntity = DtoMapper.toGameEntity(game);
            gameEntity.setUserId(playerDto.getId());
            gameEntity.setTimestamp(timestamp.getTime());
            gameRepository.save(gameEntity);
            LOGGER.debug("Spiel für User " + playerDto.getId() + " gespeichert.");
        }
        LOGGER.debug("POST auf /games: erfolgreich");
    }

    private void checkPermissions(final GameDto game) {
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        for (final PlayerDto playerDto : game.getPlayers()) {
            if (playerDto.getId() != null && playerPermissionRepository.findByUserIdAndPermittedUserId(playerDto.getId(), loggedInUserId) == null) {
                final String msg = "Missing permission for at least one player";
                LOGGER.warn(msg + ": loggedInUserId=" + loggedInUserId + ", playerId=" + playerDto.getId());
                throw new ForbiddenException(msg);
            }
        }
    }

}
