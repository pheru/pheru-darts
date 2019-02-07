package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.game.DartDto;
import de.pheru.darts.backend.dtos.game.GameDto;
import de.pheru.darts.backend.dtos.game.PlayerDto;
import de.pheru.darts.backend.entities.game.GameEntity;
import de.pheru.darts.backend.entities.notification.NotificationEntity;
import de.pheru.darts.backend.entities.notification.NotificationTemplates;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.exceptions.ForbiddenException;
import de.pheru.darts.backend.mappers.DtoToEntityMapper;
import de.pheru.darts.backend.repositories.GameRepository;
import de.pheru.darts.backend.repositories.NotificationRepository;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
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
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public GameController(final PlayerPermissionRepository playerPermissionRepository,
                          final GameRepository gameRepository,
                          final UserRepository userRepository,
                          final NotificationRepository notificationRepository) {
        this.playerPermissionRepository = playerPermissionRepository;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    public void postGame(@RequestBody final GameDto game) {
        final Date timestamp = new Date();

        checkPermissions(game);
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        String loggedInUsername = null;

        for (final PlayerDto playerDto : game.getPlayers()) {
            if (playerDto.getId() == null) {
                continue;
            }
            final DartDto[][] aufnahmen = playerDto.getAufnahmen();
            // Die letzte Aufnahme ist beim Verlierer leer und sollte nicht gespeichert werden
            if (aufnahmen[aufnahmen.length - 1].length == 0) {
                playerDto.setAufnahmen(Arrays.copyOfRange(aufnahmen, 0, aufnahmen.length - 1));
            }
            final GameEntity gameEntity = DtoToEntityMapper.toGameEntity(game);
            gameEntity.setUserId(playerDto.getId());
            gameEntity.setTimestamp(timestamp.getTime());
            gameRepository.save(gameEntity);
            LOGGER.info("Game for user " + playerDto.getId() + " saved by user " + loggedInUserId + ".");

            if (!playerDto.getId().equals(loggedInUserId)) {
                if (loggedInUsername == null) {
                    final UserEntity loggedInUser = userRepository.findById(loggedInUserId);
                    loggedInUsername = loggedInUser.getName();
                }
                final NotificationEntity notification = NotificationTemplates.gameSaved(
                        playerDto.getId(), timestamp.getTime(), loggedInUsername);
                notificationRepository.save(notification);
                LOGGER.info("Notification of type " + notification.getNotificationType()
                        + " for user " + playerDto.getId()
                        + " saved by user " + loggedInUserId + ".");
            }
        }
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