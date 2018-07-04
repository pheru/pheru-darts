package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.entities.GameEntity;
import de.pheru.darts.backend.repositories.GamesRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    private static final Logger LOGGER = new Logger();

    private final GamesRepository gamesRepository;

    public StatisticsController(final GamesRepository gamesRepository) {
        this.gamesRepository = gamesRepository;
    }

    @GetMapping
    public List<GameEntity> get() {
        LOGGER.debug("GET auf /statistics aufgerufen");

        final List<GameEntity> games = gamesRepository.findByUserId(SecurityUtil.getLoggedInUserId());

        LOGGER.debug("GET auf /statistics: erfolgreich");
        return games;
    }

}
