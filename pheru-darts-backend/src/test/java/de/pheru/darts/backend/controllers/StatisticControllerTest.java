package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.statistics.GameCountStatisticDto;
import de.pheru.darts.backend.dtos.statistics.StatisticDto;
import de.pheru.darts.backend.dtos.statistics.StatisticFilterDto;
import de.pheru.darts.backend.dtos.statistics.StatisticFilterOptionsDto;
import de.pheru.darts.backend.entities.game.GameEntity;
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
        gamesRepository.save(new GameEntityBuilder().userId(LOGIN_ID)
                .player(LOGIN_ID)
                .training(true)
                .build());
        // Spiel gegen one
        gamesRepository.save(new GameEntityBuilder().userId(LOGIN_ID)
                .player(LOGIN_ID).player(playerOne.getId())
                .build());
        // Spiel gegen two
        gamesRepository.save(new GameEntityBuilder().userId(LOGIN_ID)
                .player(LOGIN_ID).player(playerTwo.getId())
                .build());
        // Spiel gegen gelöscht 1
        gamesRepository.save(new GameEntityBuilder().userId(LOGIN_ID)
                .player(LOGIN_ID).player(DELETED_ID_ONE)
                .build());
        // Spiel gegen gelöscht 2
        gamesRepository.save(new GameEntityBuilder().userId(LOGIN_ID)
                .player(LOGIN_ID).player(DELETED_ID_TWO)
                .build());
        // Spiel gegen unregistriert
        gamesRepository.save(new GameEntityBuilder().userId(LOGIN_ID)
                .player(LOGIN_ID).player(null)
                .build());

        final StatisticFilterOptionsDto filterOptions = statisticController.getFilterOptions();

        final Map<String, List<String>> usernameToUserIds = filterOptions.getUsernameToUserIds();
        assertEquals(4, usernameToUserIds.size());

        assertTrue(usernameToUserIds.containsKey(playerOne.getName()));
        assertEquals(1, usernameToUserIds.get(playerOne.getName()).size());
        assertEquals(playerOne.getId(), usernameToUserIds.get(playerOne.getName()).get(0));

        assertTrue(usernameToUserIds.containsKey(playerTwo.getName()));
        assertEquals(1, usernameToUserIds.get(playerTwo.getName()).size());
        assertEquals(playerTwo.getId(), usernameToUserIds.get(playerTwo.getName()).get(0));

        assertTrue(usernameToUserIds.containsKey(ReservedUser.UNREGISTERED_USERS.getName()));
        assertEquals(1, usernameToUserIds.get(ReservedUser.UNREGISTERED_USERS.getName()).size());
        assertEquals(ReservedUser.UNREGISTERED_USERS.getId(), usernameToUserIds.get(ReservedUser.UNREGISTERED_USERS.getName()).get(0));

        assertTrue(usernameToUserIds.containsKey(ReservedUser.DELETED_USERS.getName()));
        assertEquals(2, usernameToUserIds.get(ReservedUser.DELETED_USERS.getName()).size());
        assertTrue(usernameToUserIds.get(ReservedUser.DELETED_USERS.getName()).contains(DELETED_ID_ONE));
        assertTrue(usernameToUserIds.get(ReservedUser.DELETED_USERS.getName()).contains(DELETED_ID_TWO));
    }

    @Test
    public void getFilterOptionsUserIdsNoGames() {
        final StatisticFilterOptionsDto filterOptions = statisticController.getFilterOptions();
        final Map<String, List<String>> usernameToUserIds = filterOptions.getUsernameToUserIds();
        assertTrue(usernameToUserIds.isEmpty());
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
        countsPerId.put(ReservedUser.UNREGISTERED_USERS.getId(), createGameCountStatistic(5L, 5L));
        games.setCountsPerPlayerIds(countsPerId);

        final Statistic result = new Statistic();
        result.setGames(games);

        mockedStatisticEvaluation.setEvaluationResult(result);

        final StatisticDto statisticDto = statisticController.get(null);
        final Map<String, GameCountStatisticDto> countsPerPlayer = statisticDto.getGames().getCountsPerPlayer();
        assertEquals(4, countsPerPlayer.size());

        assertTrue(countsPerPlayer.containsKey(playerOne.getName()));
        assertEquals(1L, countsPerPlayer.get(playerOne.getName()).getWonCount().longValue());
        assertEquals(1L, countsPerPlayer.get(playerOne.getName()).getLostCount().longValue());

        assertTrue(countsPerPlayer.containsKey(playerTwo.getName()));
        assertEquals(2L, countsPerPlayer.get(playerTwo.getName()).getWonCount().longValue());
        assertEquals(2L, countsPerPlayer.get(playerTwo.getName()).getLostCount().longValue());

        assertTrue(countsPerPlayer.containsKey(ReservedUser.DELETED_USERS.getName()));
        assertEquals(7L, countsPerPlayer.get(ReservedUser.DELETED_USERS.getName()).getWonCount().longValue());
        assertEquals(7L, countsPerPlayer.get(ReservedUser.DELETED_USERS.getName()).getLostCount().longValue());

        assertTrue(countsPerPlayer.containsKey(ReservedUser.UNREGISTERED_USERS.getName()));
        assertEquals(5L, countsPerPlayer.get(ReservedUser.UNREGISTERED_USERS.getName()).getWonCount().longValue());
        assertEquals(5L, countsPerPlayer.get(ReservedUser.UNREGISTERED_USERS.getName()).getLostCount().longValue());
    }

    @Test
    public void getWithFilter() {
        final StatisticEvaluation evaluation = (games, filter) -> {
            assertNotNull(filter);
            return new Statistic();
        };
        statisticController = new StatisticController(evaluation, gamesRepository, userRepository);
        statisticController.get(new StatisticFilterDto());
    }

    private GameCountStatistic createGameCountStatistic(final long won, final long lost){
        final GameCountStatistic gameCountStatistic = new GameCountStatistic();
        gameCountStatistic.setWonCount(won);
        gameCountStatistic.setLostCount(lost);
        return gameCountStatistic;
    }

}