package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.DartDto;
import de.pheru.darts.backend.dtos.GameDto;
import de.pheru.darts.backend.dtos.PlayerDto;
import de.pheru.darts.backend.entities.GameEntity;
import de.pheru.darts.backend.mappers.DtoMapper;
import de.pheru.darts.backend.repositories.GamesRepository;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

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

        final Date timestamp = new Date();
        //TODO Permission-Check
        for (final PlayerDto playerDto : game.getPlayers()) {
            final DartDto[][] aufnahmen = playerDto.getAufnahmen();
            // Die letzte Aufnahme ist beim Verlierer leer und sollte nicht gespeichert werden
            // TODO evtl. besser vom Client garnicht mitschicken?
            if (aufnahmen[aufnahmen.length - 1].length == 0) {
                playerDto.setAufnahmen(Arrays.copyOfRange(aufnahmen, 0, aufnahmen.length - 1));
            }
            final GameEntity gameEntity = DtoMapper.toGameEntity(game);
            gameEntity.setUserId(playerDto.getId());
            gameEntity.setTimestamp(timestamp.getTime());
            gamesRepository.save(gameEntity);
            LOGGER.debug("Spiel für User " + playerDto.getId() + " gespeichert.");
        }

        LOGGER.debug("POST auf /games: erfolgreich");
    }

    //TODO temp
    @DeleteMapping
    public void deleteGames() {
        LOGGER.debug("DELETE auf /games aufgerufen");

        gamesRepository.deleteAll();

        LOGGER.debug("DELETE auf /games: erfolgreich");
    }

    //TODO temp
    @GetMapping
    public List<GameEntity> getGames() {
//        LOGGER.debug("DELETE auf /games aufgerufen");

        return gamesRepository.findAll();

//        LOGGER.debug("DELETE auf /games: erfolgreich");
    }

}
