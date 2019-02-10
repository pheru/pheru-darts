package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.statistics.StatisticDto;
import de.pheru.darts.backend.dtos.statistics.StatisticFilterDto;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping
    public StatisticDto get(@RequestBody(required = false) final StatisticFilterDto statisticFilterDto) {
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
        final Set<String> playerIds = new HashSet<>();
        games.forEach(gameEntity -> gameEntity.getPlayers()
                .forEach(playerDocument -> {
                    if (!loggedInUserId.equals(playerDocument.getId())) {
                        playerIds.add(playerDocument.getId());
                    }
                }));
        final Map<String, String> playerIdToPlayerName = getPlayerNamesForIds(playerIds);
        final Map<String, List<String>> playerNameToPlayerIds = reversePlayerIdToPlayerName(playerIdToPlayerName);

        final List<String> operators = new ArrayList<>();
        for (final ComparativeOperator operator : ComparativeOperator.values()) {
            operators.add(operator.getOperator());
        }

        final StatisticFilterOptionsDto options = new StatisticFilterOptionsDto();
        options.setUsernameToUserIds(playerNameToPlayerIds);
        options.setComparativeOperators(operators);
        return options;
    }

    private Map<String, String> getPlayerNamesForStatistic(final Statistic statistic) {
        return getPlayerNamesForIds(statistic.getGames().getCountsPerPlayerIds().keySet());
    }

    private Map<String, String> getPlayerNamesForIds(final Set<String> playerIds) {
        final Map<String, String> playerIdToPlayerName = new HashMap<>();
        for (final String playerId : playerIds) {
            if (playerId == null) {
                playerIdToPlayerName.put(ReservedUser.UNREGISTERED_USERS.getId(), ReservedUser.UNREGISTERED_USERS.getName());
                continue;
            }
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
                playerIdToPlayerName.put(playerId, ReservedUser.DELETED_USERS.getName());
            } else {
                playerIdToPlayerName.put(playerId, userEntity.getName());
            }
        }
        return playerIdToPlayerName;
    }

    private Map<String, List<String>> reversePlayerIdToPlayerName(final Map<String, String> playerIdToPlayerName) {
        final Map<String, List<String>> reverse = new HashMap<>();

        for (final Map.Entry<String, String> entry : playerIdToPlayerName.entrySet()) {
            if (!reverse.containsKey(entry.getValue())) {
                reverse.put(entry.getValue(), new ArrayList<>());
            }
            reverse.get(entry.getValue()).add(entry.getKey());
        }
        return reverse;
    }
}