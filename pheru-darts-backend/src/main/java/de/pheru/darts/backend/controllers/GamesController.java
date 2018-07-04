package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.GameDto;
import de.pheru.darts.backend.entities.GameEntity;
import de.pheru.darts.backend.mappers.DtoMapper;
import de.pheru.darts.backend.repositories.GamesRepository;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/games")
public class GamesController {

    private static final Logger LOGGER = new Logger();

    private final UserRepository userRepository;
    private final PlayerPermissionRepository playerPermissionRepository;
    private final GamesRepository gamesRepository;

    public GamesController(final UserRepository userRepository,
                           final PlayerPermissionRepository playerPermissionRepository,
                           final GamesRepository gamesRepository) {
        this.userRepository = userRepository;
        this.playerPermissionRepository = playerPermissionRepository;
        this.gamesRepository = gamesRepository;
    }

    @PostMapping
    public void postGame(@RequestBody final GameDto game) {
        LOGGER.debug("POST auf /games aufgerufen");

        final GameEntity gameEntity = DtoMapper.toGameEntity(game);
        gameEntity.setUserId(SecurityUtil.getLoggedInUserId());
        gamesRepository.save(gameEntity);

        LOGGER.debug("POST auf /games: erfolgreich");
    }

}
