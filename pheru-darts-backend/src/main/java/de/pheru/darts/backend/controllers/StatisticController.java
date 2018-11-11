package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.statistics.*;
import de.pheru.darts.backend.entities.*;
import de.pheru.darts.backend.repositories.GameRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import de.pheru.darts.backend.util.ReservedUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/statistic")
public class StatisticController {

    private static final Logger LOGGER = new Logger();

    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public StatisticController(final GameRepository gameRepository, final UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public StatisticDto get() {
        LOGGER.debug("GET auf /statistics aufgerufen");
        final List<GameEntity> games = gameRepository.findByUserId(SecurityUtil.getLoggedInUserId());

        final Map<String, String> playerCache = new HashMap<>();

        long gamesWon = 0;
        long gamesLost = 0;
        long totalDarts = 0;
        long possibleCheckinCount = 0;
        long checkinCount = 0;
        long possibleCheckoutCount = 0;
        long checkoutCount = 0;
        final Map<Integer, DartCountStatisticDto> dartCountsPerScore = new HashMap<>();
        final Map<String, GameCountStatisticDto> gameCountsPerPlayer = new HashMap<>();

        for (final GameEntity game : games) {
            final boolean training = game.isTraining() != null && game.isTraining();
            final CheckInMode checkInMode = game.getCheckInMode() != null ? game.getCheckInMode() : CheckInMode.defaultValue();
            final CheckOutMode checkOutMode = game.getCheckOutMode();
            int score = game.getScore();
            boolean gameWon = false;
            for (final PlayerDocument playerDocument : game.getPlayers()) {
                if (playerDocument.getId() != null && playerDocument.getId().equals(SecurityUtil.getLoggedInUserId())) {
                    boolean checkInCondition = false;
                    for (final AufnahmeDocument aufnahmeDocument : playerDocument.getAufnahmen()) {
                        final int aufnahmeStartScore = score;
                        for (final DartDocument dartDocument : aufnahmeDocument.getDarts()) {
                            // Dart-Count
                            totalDarts++;
                            final Integer key = dartDocument.getValue();
                            dartCountsPerScore.putIfAbsent(key, new DartCountStatisticDto());
                            final DartCountStatisticDto dartCountStatisticDto = dartCountsPerScore.get(key);
                            if (dartDocument.getMultiplier() == 1) {
                                dartCountStatisticDto.setSingleCount(dartCountStatisticDto.getSingleCount() + 1);
                            } else if (dartDocument.getMultiplier() == 2) {
                                dartCountStatisticDto.setDoubleCount(dartCountStatisticDto.getDoubleCount() + 1);
                            } else if (dartDocument.getMultiplier() == 3) {
                                dartCountStatisticDto.setTripleCount(dartCountStatisticDto.getTripleCount() + 1);
                            }
                            if (checkOutPossible(checkOutMode, score)) {
                                possibleCheckoutCount++;
                            }
                            // Sieg-Prüfung
                            final int dartScore = dartDocument.getValue() * dartDocument.getMultiplier();
                            final boolean checkOutCondition = checkOutMode == CheckOutMode.SINGLE_OUT
                                    || (checkOutMode == CheckOutMode.DOUBLE_OUT && dartDocument.getMultiplier() == 2);
                            final boolean thrownOver = isThrownOver(score, dartScore, game.getCheckOutMode());
                            if (!checkInCondition) {
                                possibleCheckinCount++;
                                checkInCondition = checkInMode == CheckInMode.SINGLE_IN
                                        || (checkInMode == CheckInMode.DOUBLE_IN && dartDocument.getMultiplier() == 2);
                                if (checkInCondition) {
                                    checkinCount++;
                                }
                            }
                            if (checkInCondition) {
                                if (score - dartScore == 0 && checkOutCondition) { // ausgecheckt
                                    score = 0;
                                    checkoutCount++;
                                    gameWon = true;
                                } else if (thrownOver) { // ueberworfen
                                    score = aufnahmeStartScore;
                                } else {
                                    score -= dartScore;
                                }
                            }
                        }
                    }
                }
            }
            // Player-Game-Statistic
            for (final PlayerDocument playerDocument : game.getPlayers()) {
                if (playerDocument.getId() == null || !playerDocument.getId().equals(SecurityUtil.getLoggedInUserId())) {
                    final String playerName;
                    if (playerDocument.getId() != null) {
                        if (!playerCache.containsKey(playerDocument.getId())) {
                            final UserEntity userEntity = userRepository.findById(playerDocument.getId());
                            if (userEntity == null) {
                                playerCache.put(playerDocument.getId(), ReservedUser.DELETED_USER.getName());
                            } else {
                                playerCache.put(playerDocument.getId(), userEntity.getName());
                            }
                        }
                        playerName = playerCache.get(playerDocument.getId());
                    } else {
                        playerName = ReservedUser.UNREGISTERED_USER.getName();
                    }
                    gameCountsPerPlayer.putIfAbsent(playerName, new GameCountStatisticDto());
                    final GameCountStatisticDto gameCountStatisticDto = gameCountsPerPlayer.get(playerName);
                    if (gameWon) {
                        gameCountStatisticDto.setWonCount(gameCountStatisticDto.getWonCount() + 1);
                    } else {
                        gameCountStatisticDto.setLostCount(gameCountStatisticDto.getLostCount() + 1);
                    }
                }
            }
            if (!training) {
                if (gameWon) {
                    gamesWon++;
                } else {
                    gamesLost++;
                }
            }
        }
        final GameStatisticDto gameStatisticDto = new GameStatisticDto();
        gameStatisticDto.setWonCount(gamesWon);
        gameStatisticDto.setLostCount(gamesLost);
        gameStatisticDto.setCountsPerPlayer(gameCountsPerPlayer);

        final DartStatisticDto dartStatisticDto = new DartStatisticDto();
        dartStatisticDto.setTotalCount(totalDarts);
        dartStatisticDto.setPossibleCheckoutCount(possibleCheckoutCount);
        dartStatisticDto.setCheckoutCount(checkoutCount);
        dartStatisticDto.setPossibleCheckinCount(possibleCheckinCount);
        dartStatisticDto.setCheckinCount(checkinCount);
        dartStatisticDto.setCountsPerScore(dartCountsPerScore);

        final StatisticDto statisticDto = new StatisticDto();
        statisticDto.setGames(gameStatisticDto);
        statisticDto.setDarts(dartStatisticDto);

        LOGGER.debug("GET auf /statistics: erfolgreich");
        return statisticDto;
    }

    private boolean checkOutPossible(final CheckOutMode checkOutMode, final int score) {
        if (checkOutMode == CheckOutMode.SINGLE_OUT) {
            return score <= 20
                    || score == 25
                    || score == 50
                    || (score <= 40 && score % 2 == 0)
                    || (score <= 60 && score % 3 == 0);
        } else {
            return score == 50
                    || (score <= 40 && score % 2 == 0);
        }
    }

    private boolean isThrownOver(final int score, final int dartScore, final CheckOutMode checkOutMode) {
        return score - dartScore <= (checkOutMode == CheckOutMode.SINGLE_OUT ? 0 : 1);
    }

}
