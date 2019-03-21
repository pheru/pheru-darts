package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.statistics.StatisticDto;
import de.pheru.darts.backend.dtos.statistics.StatisticFilterDto;
import de.pheru.darts.backend.dtos.statistics.StatisticFilterGameOptionDto;
import de.pheru.darts.backend.dtos.statistics.StatisticFilterOptionsDto;
import de.pheru.darts.backend.entities.game.GameEntity;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.mappers.DtoToModelMapper;
import de.pheru.darts.backend.mappers.ModelToDtoMapper;
import de.pheru.darts.backend.repositories.GameRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import de.pheru.darts.backend.statistics.Statistic;
import de.pheru.darts.backend.statistics.StatisticEvaluation;
import de.pheru.darts.backend.statistics.StatisticFilter;
import de.pheru.darts.backend.util.ComparativeOperator;
import de.pheru.darts.backend.util.ReservedUser;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/statistic")
public class StatisticController {

    private final StatisticEvaluation statisticEvaluation;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public StatisticController(final StatisticEvaluation statisticEvaluation,
                               final GameRepository gameRepository,
                               final UserRepository userRepository) {
        this.statisticEvaluation = statisticEvaluation;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public StatisticDto createStatistic(@RequestBody(required = false) final StatisticFilterDto statisticFilterDto) {
        final List<GameEntity> games = gameRepository.findByUserId(SecurityUtil.getLoggedInUserId());

        final StatisticFilter filter = DtoToModelMapper.toStatisticFilter(statisticFilterDto);
        final Statistic statistic = statisticEvaluation.evaluate(games, filter);

        final Map<String, String> playerIdToPlayerName = getPlayerNamesForStatistic(statistic);

        return ModelToDtoMapper.toStatisticDto(statistic, playerIdToPlayerName);
    }

    @GetMapping("/filterOptions")
    public StatisticFilterOptionsDto getFilterOptions() {
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        final List<GameEntity> games = gameRepository.findByUserId(loggedInUserId);

        final Map<String, Set<String>> playerNameToPlayerIds = new HashMap<>();
        final List<StatisticFilterGameOptionDto> gameOptionDtos = new ArrayList<>();
        games.forEach(gameEntity -> {
            final StatisticFilterGameOptionDto gameOptionDto = new StatisticFilterGameOptionDto();
            gameOptionDto.setId(gameEntity.getId());
            gameOptionDto.setTimestamp(gameEntity.getTimestamp());
            gameOptionDto.setOpponents(new ArrayList<>());
            if (gameEntity.isTrainingOrDefault()
                    && !playerNameToPlayerIds.containsKey(ReservedUser.TRAINING.getName())) {
                playerNameToPlayerIds.put(ReservedUser.TRAINING.getName(), new HashSet<>());
                playerNameToPlayerIds.get(ReservedUser.TRAINING.getName()).add(ReservedUser.TRAINING.getId());
            }
            gameEntity.getPlayers()
                    .forEach(playerDocument -> {
                        if (!loggedInUserId.equals(playerDocument.getId())) {
                            final String playerIdNotNull = playerDocument.getId() == null
                                    ? ReservedUser.UNREGISTERED_USER.getId() : playerDocument.getId();
                            final String playerName = playerNameForId(playerIdNotNull);
                            if (!playerNameToPlayerIds.containsKey(playerName)) {
                                playerNameToPlayerIds.put(playerName, new HashSet<>());
                            }
                            playerNameToPlayerIds.get(playerName).add(playerIdNotNull);
                            gameOptionDto.getOpponents().add(playerName);
                        }
                    });
            gameOptionDtos.add(gameOptionDto);
        });

        final List<String> operators = new ArrayList<>();
        for (final ComparativeOperator operator : ComparativeOperator.values()) {
            operators.add(operator.getOperator());
        }

        final StatisticFilterOptionsDto options = new StatisticFilterOptionsDto();
        options.setUsernameToUserIds(playerNameToPlayerIds);
        options.setComparativeOperators(operators);
        options.setGames(gameOptionDtos);
        return options;
    }

    private String playerNameForId(final String playerId) {
        for (final ReservedUser reservedUser : ReservedUser.values()) {
            if (reservedUser.getId().equals(playerId)) {
                return reservedUser.getName();
            }
        }
        final UserEntity userEntity = userRepository.findById(playerId);
        if (userEntity == null) {
            return ReservedUser.DELETED_USER.getName();
        } else {
            return userEntity.getName();
        }
    }

    private Map<String, String> getPlayerNamesForStatistic(final Statistic statistic) {
        return getPlayerNamesForIds(statistic.getGames().getCountsPerPlayerIds().keySet());
    }

    private Map<String, String> getPlayerNamesForIds(final Set<String> playerIds) {
        final Map<String, String> playerIdToPlayerName = new HashMap<>();
        for (final String playerId : playerIds) {
            boolean isReservedUserId = false;
            for (final ReservedUser reservedUser : ReservedUser.values()) {
                if (reservedUser.getId().equals(playerId)) {
                    playerIdToPlayerName.put(playerId, reservedUser.getName());
                    isReservedUserId = true;
                    break;
                }
            }
            if (isReservedUserId) {
                continue;
            }
            final UserEntity userEntity = userRepository.findById(playerId);
            if (userEntity == null) {
                playerIdToPlayerName.put(playerId, ReservedUser.DELETED_USER.getName());
            } else {
                playerIdToPlayerName.put(playerId, userEntity.getName());
            }
        }
        return playerIdToPlayerName;
    }

}