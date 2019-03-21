package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.statistics.*;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.mocks.statistics.MockedStatisticEvaluation;
import de.pheru.darts.backend.statistics.*;
import de.pheru.darts.backend.testutil.GameEntityBuilder;
import de.pheru.darts.backend.util.ComparativeOperator;
import de.pheru.darts.backend.util.ReservedUser;
import org.junit.Before;
import org.junit.Test;

import java.util.*;

import static org.junit.Assert.*;

public class StatisticControllerTest extends ControllerTest {

    private static final String GAME_ID_ONE = "game-1";
    private static final String GAME_ID_TWO = "game-2";
    private static final String DELETED_ID_ONE = "deleted-1";
    private static final String DELETED_ID_TWO = "deleted-2";

    private StatisticController statisticController;
    private MockedStatisticEvaluation mockedStatisticEvaluation;

    @Before
    public void setUp() {
        mockedStatisticEvaluation = new MockedStatisticEvaluation();
        statisticController = new StatisticController(mockedStatisticEvaluation, gamesRepository, userRepository);
    }

    @Test
    public void getFilterOptionsDifferentUserIds() {
        createAndSaveDefaultLoginUser();
        final UserEntity playerOne = createAndSaveUser("Name 1", "Password 1");
        final UserEntity playerTwo = createAndSaveUser("Name 2", "Password 2");

        // Trainingsmatch
        gamesRepository.save(new GameEntityBuilder()
                .id(GAME_ID_ONE)
                .userId(LOGIN_ID)
                .player(LOGIN_ID)
                .training(true)
                .timestamp(1L)
                .build());
        // Spiel gegen one
        gamesRepository.save(new GameEntityBuilder()
                .id(GAME_ID_TWO)
                .userId(LOGIN_ID)
                .player(LOGIN_ID)
                .player(playerOne.getId())
                .timestamp(2L)
                .build());
        // Spiel gegen one und two
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .player(LOGIN_ID)
                .player(playerOne.getId())
                .player(playerTwo.getId())
                .timestamp(3L)
                .build());
        // Spiel gegen gelöscht 1
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .player(LOGIN_ID)
                .player(DELETED_ID_ONE)
                .timestamp(4L)
                .build());
        // Spiel gegen gelöscht 2
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .player(LOGIN_ID)
                .player(DELETED_ID_TWO)
                .timestamp(5L)
                .build());
        // Spiel gegen unregistriert
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .player(LOGIN_ID)
                .player(null)
                .timestamp(6L)
                .build());

        final StatisticFilterOptionsDto filterOptions = statisticController.getFilterOptions();

        final Map<String, Set<String>> usernameToUserIds = filterOptions.getUsernameToUserIds();
        assertEquals(5, usernameToUserIds.size());

        assertTrue(usernameToUserIds.containsKey(ReservedUser.TRAINING.getName()));
        assertEquals(1, usernameToUserIds.get(ReservedUser.TRAINING.getName()).size());
        assertTrue(usernameToUserIds.get(ReservedUser.TRAINING.getName()).contains(ReservedUser.TRAINING.getId()));

        assertTrue(usernameToUserIds.containsKey(playerOne.getName()));
        assertEquals(1, usernameToUserIds.get(playerOne.getName()).size());
        assertTrue(usernameToUserIds.get(playerOne.getName()).contains(playerOne.getId()));

        assertTrue(usernameToUserIds.containsKey(playerTwo.getName()));
        assertEquals(1, usernameToUserIds.get(playerTwo.getName()).size());
        assertTrue(usernameToUserIds.get(playerTwo.getName()).contains(playerTwo.getId()));

        assertTrue(usernameToUserIds.containsKey(ReservedUser.UNREGISTERED_USER.getName()));
        assertEquals(1, usernameToUserIds.get(ReservedUser.UNREGISTERED_USER.getName()).size());
        assertTrue(usernameToUserIds.get(ReservedUser.UNREGISTERED_USER.getName()).contains(ReservedUser.UNREGISTERED_USER.getId()));

        assertTrue(usernameToUserIds.containsKey(ReservedUser.DELETED_USER.getName()));
        assertEquals(2, usernameToUserIds.get(ReservedUser.DELETED_USER.getName()).size());
        assertTrue(usernameToUserIds.get(ReservedUser.DELETED_USER.getName()).contains(DELETED_ID_ONE));
        assertTrue(usernameToUserIds.get(ReservedUser.DELETED_USER.getName()).contains(DELETED_ID_TWO));

        assertEquals(ComparativeOperator.values().length, filterOptions.getComparativeOperators().size());

        final List<StatisticFilterGameOptionDto> games = filterOptions.getGames();
        assertEquals(6, games.size());
        assertEquals(GAME_ID_ONE, games.get(0).getId());
        assertEquals(0, games.get(0).getOpponents().size());
        assertEquals(1L, games.get(0).getTimestamp());
        assertEquals(GAME_ID_TWO, games.get(1).getId());
        assertEquals(1, games.get(1).getOpponents().size());
        assertEquals(2L, games.get(1).getTimestamp());
        assertEquals(2, games.get(2).getOpponents().size());
        assertEquals(1, games.get(3).getOpponents().size());
        assertEquals(1, games.get(4).getOpponents().size());
        assertEquals(1, games.get(5).getOpponents().size());
    }

    @Test
    public void getFilterOptionsNoGamesPlayed() {
        final StatisticFilterOptionsDto filterOptions = statisticController.getFilterOptions();
        assertTrue(filterOptions.getUsernameToUserIds().isEmpty());
        assertTrue(filterOptions.getGames().isEmpty());
        assertEquals(ComparativeOperator.values().length, filterOptions.getComparativeOperators().size());
    }

    @Test
    public void getFilterOptionsComparativeOperators() {
        final StatisticFilterOptionsDto filterOptions = statisticController.getFilterOptions();

        final List<String> comparativeOperators = filterOptions.getComparativeOperators();
        final Object[] comparativeOperatorValuesStringArray = Arrays.stream(ComparativeOperator.values())
                .map(ComparativeOperator::getOperator)
                .toArray();
        assertArrayEquals(comparativeOperatorValuesStringArray, comparativeOperators.toArray());
    }

    @Test
    public void get() {
        createAndSaveDefaultLoginUser();
        final UserEntity playerOne = createAndSaveUser("Name 1", "Password 1");
        final UserEntity playerTwo = createAndSaveUser("Name 2", "Password 2");

        final GameStatistic games = new GameStatistic();
        final Map<String, GameCountStatistic> countsPerId = new HashMap<>();
        countsPerId.put(playerOne.getId(), createGameCountStatistic(1L, 1L));
        countsPerId.put(playerTwo.getId(), createGameCountStatistic(2L, 2L));
        countsPerId.put(DELETED_ID_ONE, createGameCountStatistic(3L, 3L));
        countsPerId.put(DELETED_ID_TWO, createGameCountStatistic(4L, 4L));
        countsPerId.put(ReservedUser.UNREGISTERED_USER.getId(), createGameCountStatistic(5L, 5L));
        games.setCountsPerPlayerIds(countsPerId);

        final Statistic result = new Statistic();
        result.setGames(games);

        mockedStatisticEvaluation.setEvaluationResult(result);

        final StatisticDto statisticDto = statisticController.createStatistic(null);
        final Map<String, GameCountStatisticDto> countsPerPlayer = statisticDto.getGames().getCountsPerPlayer();
        assertEquals(4, countsPerPlayer.size());

        assertTrue(countsPerPlayer.containsKey(playerOne.getName()));
        assertEquals(1L, countsPerPlayer.get(playerOne.getName()).getWonCount().longValue());
        assertEquals(1L, countsPerPlayer.get(playerOne.getName()).getLostCount().longValue());

        assertTrue(countsPerPlayer.containsKey(playerTwo.getName()));
        assertEquals(2L, countsPerPlayer.get(playerTwo.getName()).getWonCount().longValue());
        assertEquals(2L, countsPerPlayer.get(playerTwo.getName()).getLostCount().longValue());

        assertTrue(countsPerPlayer.containsKey(ReservedUser.DELETED_USER.getName()));
        assertEquals(7L, countsPerPlayer.get(ReservedUser.DELETED_USER.getName()).getWonCount().longValue());
        assertEquals(7L, countsPerPlayer.get(ReservedUser.DELETED_USER.getName()).getLostCount().longValue());

        assertTrue(countsPerPlayer.containsKey(ReservedUser.UNREGISTERED_USER.getName()));
        assertEquals(5L, countsPerPlayer.get(ReservedUser.UNREGISTERED_USER.getName()).getWonCount().longValue());
        assertEquals(5L, countsPerPlayer.get(ReservedUser.UNREGISTERED_USER.getName()).getLostCount().longValue());
    }

    @Test
    public void getWithFilter() {
        final StatisticEvaluation evaluation = (games, filter) -> {
            assertNotNull(filter);
            return new Statistic();
        };
        statisticController = new StatisticController(evaluation, gamesRepository, userRepository);
        statisticController.createStatistic(new StatisticFilterDto());
    }

    private GameCountStatistic createGameCountStatistic(final long won, final long lost){
        final GameCountStatistic gameCountStatistic = new GameCountStatistic();
        gameCountStatistic.setWonCount(won);
        gameCountStatistic.setLostCount(lost);
        return gameCountStatistic;
    }

}