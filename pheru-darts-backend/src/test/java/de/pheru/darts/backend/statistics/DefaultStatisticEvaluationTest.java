package de.pheru.darts.backend.statistics;

import de.pheru.darts.backend.entities.game.CheckInMode;
import de.pheru.darts.backend.entities.game.CheckOutMode;
import de.pheru.darts.backend.entities.game.GameEntity;
import de.pheru.darts.backend.testutil.AufnahmeDocumentBuilder;
import de.pheru.darts.backend.testutil.DartDocumentBuilder;
import de.pheru.darts.backend.testutil.GameEntityBuilder;
import de.pheru.darts.backend.testutil.SecurityTestUtil;
import de.pheru.darts.backend.util.ComparativeOperator;
import de.pheru.darts.backend.util.ReservedUser;
import org.junit.Before;
import org.junit.Test;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.junit.Assert.*;

public class DefaultStatisticEvaluationTest {

    private static final double AVERAGE_DELTA = 0.001;
    private static final String LOGGED_IN_ID = "logged-in-id";
    private static final String PLAYER_TWO_ID = "player-2-id";
    private static final String PLAYER_THREE_ID = "player-3-id";

    private final DateFormat dateFormatDateTime = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
    private final DateFormat dateFormatDate = new SimpleDateFormat("dd.MM.yyyy");

    @Before
    public void setUp() {
        SecurityTestUtil.setIdAuthenticationInSecurityContext(LOGGED_IN_ID);
    }

    @Test
    public void evaluate() throws Exception {
        final List<GameEntity> games = new ArrayList<>();
        games.add(game3SiegPlayerThree());
        games.add(game2NiederlagePlayerTwo());
        games.add(game5SiegUnregistriertDoubleIn());
        games.add(training1());
        games.add(game4SiegUnregistriert());
        games.add(game1SiegPlayerTwo());

        final Statistic statistic = new DefaultStatisticEvaluation().evaluate(games, null);
        final DartStatistic dartStatistics = statistic.getDarts();
        final Map<Integer, DartCountStatistic> countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(28, dartStatistics.getTotalCount().longValue());
        assertEquals(8, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(5, dartStatistics.getCheckoutCount().longValue());
        assertEquals(9, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(6, dartStatistics.getCheckinCount().longValue());
        assertDartCount(countsPerScore.get(25), 0, 5, 0);
        assertDartCount(countsPerScore.get(20), 4, 1, 5);
        assertNull(countsPerScore.get(19));
        assertDartCount(countsPerScore.get(18), 0, 1, 0);
        assertDartCount(countsPerScore.get(17), 1, 0, 4);
        assertNull(countsPerScore.get(16));
        assertDartCount(countsPerScore.get(15), 0, 1, 0);
        assertDartCount(countsPerScore.get(10), 1, 0, 0);
        assertNull(countsPerScore.get(5));
        assertDartCount(countsPerScore.get(2), 0, 0, 1);
        assertDartCount(countsPerScore.get(1), 4, 0, 0);


        final GameStatistic gamesStatistics = statistic.getGames();
        final Map<String, GameCountStatistic> countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(4, gamesStatistics.getWonCount().longValue());
        assertEquals(1, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_TWO_ID).getWonCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_TWO_ID).getLostCount().longValue());
        assertEquals(2, countsPerPlayerId.get(ReservedUser.UNREGISTERED_USER.getId()).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(ReservedUser.UNREGISTERED_USER.getId()).getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_THREE_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_THREE_ID).getLostCount().longValue());

        final AufnahmeStatistic aufnahmeStatistic = statistic.getAufnahmen();
        final Map<Integer, Integer> highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(57.0, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(120).intValue());
        assertEquals(4, highestAufnahmen.get(101).intValue());
        assertEquals(1, highestAufnahmen.get(60).intValue());
        assertEquals(1, highestAufnahmen.get(59).intValue());
        assertEquals(1, highestAufnahmen.get(41).intValue());

        final List<ProgressStatistic> progress = statistic.getProgress();
        assertEquals(6, progress.size());
        progress.sort(Comparator.comparingLong(o -> o.getGameInformation().getTimestamp()));
        assertEquals(101, progress.get(0).getAverageAufnahmeScoreCurrentGame(), AVERAGE_DELTA);
        assertEquals(101, progress.get(0).getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(50.5, progress.get(1).getAverageAufnahmeScoreCurrentGame(), AVERAGE_DELTA);
        assertEquals(67.333, progress.get(1).getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(59.666, progress.get(2).getAverageAufnahmeScoreCurrentGame(), AVERAGE_DELTA);
        assertEquals(63.5, progress.get(2).getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(50.5, progress.get(3).getAverageAufnahmeScoreCurrentGame(), AVERAGE_DELTA);
        assertEquals(60.25, progress.get(3).getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(101, progress.get(4).getAverageAufnahmeScoreCurrentGame(), AVERAGE_DELTA);
        assertEquals(64.777, progress.get(4).getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(33.666, progress.get(5).getAverageAufnahmeScoreCurrentGame(), AVERAGE_DELTA);
        assertEquals(57.0, progress.get(5).getAverageAufnahmeScore(), AVERAGE_DELTA);
    }

    @Test
    public void evaluateFilterGameIds() {
        final String gameId1 = "game-id-1";
        final String gameId2 = "game-id-2";
        final List<GameEntity> games = new ArrayList<>();
        games.add(new GameEntityBuilder()
                .id(gameId1)
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(5)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .build());
        games.add(new GameEntityBuilder()
                .id(gameId2)
                .player(LOGGED_IN_ID)
                .player(PLAYER_THREE_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(3)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(3).multiplier(1).build())
                        .build())
                .build());
        games.add(new GameEntityBuilder()
                .id("nicht im filter")
                .player(LOGGED_IN_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(5)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .build());

        final StatisticFilter filter = new StatisticFilter();
        filter.setGameIds(Arrays.asList(gameId1, gameId2));
        final Statistic statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        final DartStatistic dartStatistics = statistic.getDarts();
        final Map<Integer, DartCountStatistic> countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(2, dartStatistics.getTotalCount().longValue());
        assertEquals(2, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getCheckoutCount().longValue());
        assertEquals(2, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(2, dartStatistics.getCheckinCount().longValue());
        assertDartCount(countsPerScore.get(5), 2, 0, 0);

        final GameStatistic gamesStatistics = statistic.getGames();
        final Map<String, GameCountStatistic> countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(1, gamesStatistics.getWonCount().longValue());
        assertEquals(1, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_TWO_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_TWO_ID).getLostCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_THREE_ID).getWonCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_THREE_ID).getLostCount().longValue());

        final AufnahmeStatistic aufnahmeStatistic = statistic.getAufnahmen();
        final Map<Integer, Integer> highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(2.5, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(5).intValue());
        assertEquals(1, highestAufnahmen.get(0).intValue());
    }

    @Test
    public void evaluateFilterUserIds() {
        final List<GameEntity> games = new ArrayList<>();
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(5)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .build());
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_THREE_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(3)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(3).multiplier(1).build())
                        .build())
                .build());
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player("Nicht im Filter")
                .timestamp(1L)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(5)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .build());

        final StatisticFilter filter = new StatisticFilter();
        filter.setUserIds(Arrays.asList(PLAYER_TWO_ID, PLAYER_THREE_ID));
        final Statistic statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        final DartStatistic dartStatistics = statistic.getDarts();
        final Map<Integer, DartCountStatistic> countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(2, dartStatistics.getTotalCount().longValue());
        assertEquals(2, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getCheckoutCount().longValue());
        assertEquals(2, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(2, dartStatistics.getCheckinCount().longValue());
        assertDartCount(countsPerScore.get(5), 2, 0, 0);

        final GameStatistic gamesStatistics = statistic.getGames();
        final Map<String, GameCountStatistic> countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(1, gamesStatistics.getWonCount().longValue());
        assertEquals(1, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_TWO_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_TWO_ID).getLostCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_THREE_ID).getWonCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_THREE_ID).getLostCount().longValue());

        final AufnahmeStatistic aufnahmeStatistic = statistic.getAufnahmen();
        final Map<Integer, Integer> highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(2.5, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(5).intValue());
        assertEquals(1, highestAufnahmen.get(0).intValue());
    }

    @Test
    public void evaluateFilterCheckInMode() {
        final List<GameEntity> games = new ArrayList<>();
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(1L)
                .checkInMode(CheckInMode.SINGLE_IN)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(5)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .build());
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_THREE_ID)
                .timestamp(1L)
                .checkInMode(CheckInMode.DOUBLE_IN)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(10)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(2).build())
                        .build())
                .build());

        final StatisticFilter filter = new StatisticFilter();
        filter.setCheckInModes(Collections.singletonList(CheckInMode.DOUBLE_IN));
        final Statistic statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        final DartStatistic dartStatistics = statistic.getDarts();
        final Map<Integer, DartCountStatistic> countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(1, dartStatistics.getTotalCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(1, dartStatistics.getCheckinCount().longValue());
        assertDartCount(countsPerScore.get(5), 0, 1, 0);

        final GameStatistic gamesStatistics = statistic.getGames();
        final Map<String, GameCountStatistic> countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(1, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_THREE_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_THREE_ID).getLostCount().longValue());

        final AufnahmeStatistic aufnahmeStatistic = statistic.getAufnahmen();
        final Map<Integer, Integer> highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(10, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(10).intValue());
    }

    @Test
    public void evaluateFilterCheckOutMode() {
        final List<GameEntity> games = new ArrayList<>();
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(5)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .build());
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_THREE_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(10)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(2).build())
                        .build())
                .build());
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.MASTER_OUT)
                .score(15)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(3).build())
                        .build())
                .build());

        final StatisticFilter filter = new StatisticFilter();
        filter.setCheckOutModes(Arrays.asList(CheckOutMode.SINGLE_OUT, CheckOutMode.MASTER_OUT));
        final Statistic statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        final DartStatistic dartStatistics = statistic.getDarts();
        final Map<Integer, DartCountStatistic> countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(2, dartStatistics.getTotalCount().longValue());
        assertEquals(2, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(2, dartStatistics.getCheckoutCount().longValue());
        assertEquals(2, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(2, dartStatistics.getCheckinCount().longValue());
        assertDartCount(countsPerScore.get(5), 1, 0, 1);

        final GameStatistic gamesStatistics = statistic.getGames();
        final Map<String, GameCountStatistic> countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(2, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertEquals(2, countsPerPlayerId.get(PLAYER_TWO_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_TWO_ID).getLostCount().longValue());

        final AufnahmeStatistic aufnahmeStatistic = statistic.getAufnahmen();
        final Map<Integer, Integer> highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(10, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(5).intValue());
        assertEquals(1, highestAufnahmen.get(15).intValue());
    }

    @Test
    public void evaluateFilterStartScore() {
        final List<GameEntity> games = new ArrayList<>();
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(5)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .build());
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_THREE_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(20)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(1).build())
                        .build())
                .build());

        // Startscore = 5
        StatisticFilter filter = new StatisticFilter();
        filter.setStartScore(5);
        filter.setStartScoreComparatorOperator(ComparativeOperator.EQUAL);
        Statistic statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        DartStatistic dartStatistics = statistic.getDarts();
        Map<Integer, DartCountStatistic> countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(1, dartStatistics.getTotalCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(1, dartStatistics.getCheckinCount().longValue());
        assertDartCount(countsPerScore.get(5), 1, 0, 0);
        assertNull(countsPerScore.get(20));

        GameStatistic gamesStatistics = statistic.getGames();
        Map<String, GameCountStatistic> countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(1, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_TWO_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_TWO_ID).getLostCount().longValue());

        AufnahmeStatistic aufnahmeStatistic = statistic.getAufnahmen();
        Map<Integer, Integer> highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(5, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(5).intValue());

        // Startscore > 10
        filter = new StatisticFilter();
        filter.setStartScore(10);
        filter.setStartScoreComparatorOperator(ComparativeOperator.GREATER);
        statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        dartStatistics = statistic.getDarts();
        countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(1, dartStatistics.getTotalCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(1, dartStatistics.getCheckinCount().longValue());
        assertNull(countsPerScore.get(5));
        assertDartCount(countsPerScore.get(20), 1, 0, 0);

        gamesStatistics = statistic.getGames();
        countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(1, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_THREE_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_THREE_ID).getLostCount().longValue());

        aufnahmeStatistic = statistic.getAufnahmen();
        highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(20, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(20).intValue());
    }

    @Test
    public void evaluateFilterTimestamp() throws Exception {
        final List<GameEntity> games = new ArrayList<>();
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(dateFormatDateTime.parse("02.02.2002 02:02:02").getTime())
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(5)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(5).multiplier(1).build())
                        .build())
                .build());
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_THREE_ID)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .timestamp(dateFormatDateTime.parse("03.03.2003 03:03:03").getTime())
                .score(20)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(1).build())
                        .build())
                .build());

        // Date = 02.02.2002
        StatisticFilter filter = new StatisticFilter();
        filter.setStartDate(dateFormatDate.parse("02.02.2002").getTime());
        filter.setEndDate(dateFormatDate.parse("02.02.2002").getTime());
        Statistic statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        DartStatistic dartStatistics = statistic.getDarts();
        Map<Integer, DartCountStatistic> countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(1, dartStatistics.getTotalCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(1, dartStatistics.getCheckinCount().longValue());
        assertDartCount(countsPerScore.get(5), 1, 0, 0);
        assertNull(countsPerScore.get(20));

        GameStatistic gamesStatistics = statistic.getGames();
        Map<String, GameCountStatistic> countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(1, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_TWO_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_TWO_ID).getLostCount().longValue());

        AufnahmeStatistic aufnahmeStatistic = statistic.getAufnahmen();
        Map<Integer, Integer> highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(5, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(5).intValue());

        // Date >= 03.02.2002
        filter = new StatisticFilter();
        filter.setStartDate(dateFormatDate.parse("03.02.2002").getTime());
        statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        dartStatistics = statistic.getDarts();
        countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(1, dartStatistics.getTotalCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(1, dartStatistics.getCheckinCount().longValue());
        assertNull(countsPerScore.get(5));
        assertDartCount(countsPerScore.get(20), 1, 0, 0);

        gamesStatistics = statistic.getGames();
        countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(1, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_THREE_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_THREE_ID).getLostCount().longValue());

        aufnahmeStatistic = statistic.getAufnahmen();
        highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(20, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(20).intValue());
    }

    @Test
    public void evaluateFilterCurrentScore() {
        final List<GameEntity> games = new ArrayList<>();
        games.add(new GameEntityBuilder()
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(1L)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(1).multiplier(1).build()) // 100
                        .dart(new DartDocumentBuilder().value(20).multiplier(1).build()) // 80
                        .dart(new DartDocumentBuilder().value(20).multiplier(1).build()) // 60
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder().build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(1).build()) // 40
                        .dart(new DartDocumentBuilder().value(20).multiplier(1).build()) // 20
                        .dart(new DartDocumentBuilder().value(20).multiplier(1).build()) // überworfen -> 60
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder().build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(1).build()) // 40
                        .dart(new DartDocumentBuilder().value(20).multiplier(2).build()) // 0
                        .build())
                .build());

        // CurrentScore > 40
        StatisticFilter filter = new StatisticFilter();
        filter.setCurrentScore(40);
        filter.setCurrentScoreComparativeOperator((ComparativeOperator.GREATER));
        Statistic statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        DartStatistic dartStatistics = statistic.getDarts();
        Map<Integer, DartCountStatistic> countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(5, dartStatistics.getTotalCount().longValue());
        assertEquals(0, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(0, dartStatistics.getCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(1, dartStatistics.getCheckinCount().longValue());
        assertDartCount(countsPerScore.get(1), 1, 0, 0);
        assertDartCount(countsPerScore.get(20), 4, 0, 0);

        GameStatistic gamesStatistics = statistic.getGames();
        Map<String, GameCountStatistic> countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(1, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_TWO_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_TWO_ID).getLostCount().longValue());

        AufnahmeStatistic aufnahmeStatistic = statistic.getAufnahmen();
        Map<Integer, Integer> highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(33.666, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertEquals(1, highestAufnahmen.get(41).intValue());
        assertEquals(1, highestAufnahmen.get(0).intValue());
        assertEquals(1, highestAufnahmen.get(60).intValue());

        // CurrentScore = 40
        filter = new StatisticFilter();
        filter.setCurrentScore(40);
        filter.setCurrentScoreComparativeOperator((ComparativeOperator.EQUAL));
        statistic = new DefaultStatisticEvaluation().evaluate(games, filter);
        dartStatistics = statistic.getDarts();
        countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(2, dartStatistics.getTotalCount().longValue());
        assertEquals(2, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(1, dartStatistics.getCheckoutCount().longValue());
        assertEquals(0, dartStatistics.getPossibleCheckinCount().longValue());
        assertEquals(0, dartStatistics.getCheckinCount().longValue());
        assertDartCount(countsPerScore.get(20), 1, 1, 0);

        gamesStatistics = statistic.getGames();
        countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(1, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayerId.get(PLAYER_TWO_ID).getWonCount().longValue());
        assertEquals(0, countsPerPlayerId.get(PLAYER_TWO_ID).getLostCount().longValue());

        aufnahmeStatistic = statistic.getAufnahmen();
        highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(0, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertTrue(highestAufnahmen.isEmpty());
    }

    @Test
    public void evaluateNoGamesPlayed() {
        final Statistic statistic = new DefaultStatisticEvaluation().evaluate(new ArrayList<>(), null);
        final DartStatistic dartStatistics = statistic.getDarts();
        final Map<Integer, DartCountStatistic> countsPerScore = dartStatistics.getCountsPerScore();

        assertEquals(0, dartStatistics.getTotalCount().longValue());
        assertEquals(0, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(0, dartStatistics.getCheckoutCount().longValue());
        assertTrue(countsPerScore.isEmpty());

        final GameStatistic gamesStatistics = statistic.getGames();
        final Map<String, GameCountStatistic> countsPerPlayerId = gamesStatistics.getCountsPerPlayerIds();
        assertEquals(0, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertTrue(countsPerPlayerId.isEmpty());

        final AufnahmeStatistic aufnahmeStatistic = statistic.getAufnahmen();
        final Map<Integer, Integer> highestAufnahmen = aufnahmeStatistic.getHighestAufnahmen();
        assertEquals(0.0, aufnahmeStatistic.getAverageAufnahmeScore(), AVERAGE_DELTA);
        assertTrue(highestAufnahmen.isEmpty());
    }

    private void assertDartCount(final DartCountStatistic dartStatistic, final long singleCount, final long doubleCount, final long tripleCount) {
        assertEquals(singleCount, dartStatistic.getSingleCount().longValue());
        assertEquals(doubleCount, dartStatistic.getDoubleCount().longValue());
        assertEquals(tripleCount, dartStatistic.getTripleCount().longValue());
    }

    /**
     * Training 1: Trainingsspiel <br/>
     * 2 Darts <br/>
     * - 1x D25 <br/>
     * - 1x T17 <br/>
     * Checkout: 1/1
     */
    private GameEntity training1() throws ParseException {
        return new GameEntityBuilder()
                .id("training-1")
                .userId(LOGGED_IN_ID)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .training(true)
                .player(LOGGED_IN_ID)
                .timestamp(dateFormatDateTime.parse("01.01.2001 01:01:01").getTime())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).multiplier(3).build()) // 51
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 101
                        .build())
                .build();
    }

    /**
     * Spiel 1: Sieg gegen Player Two <br/>
     * 6 Darts <br/>
     * - 3x  20 <br/>
     * - 1x D15 <br/>
     * - 1x  10 <br/>
     * - 1x   1 <br/>
     * Checkout: 1/2
     */
    private GameEntity game1SiegPlayerTwo() throws ParseException {
        return new GameEntityBuilder()
                .id("1-sieg-player-two")
                .userId(LOGGED_IN_ID)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(dateFormatDateTime.parse("02.02.2002 02:02:02").getTime())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).build()) // 20
                        .dart(new DartDocumentBuilder().value(20).build()) // 40
                        .dart(new DartDocumentBuilder().value(20).build()) // 60
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder().build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(1).build()) // 61
                        .dart(new DartDocumentBuilder().value(10).build()) // 71
                        .dart(new DartDocumentBuilder().value(15).multiplier(2).build()) // 101
                        .build())
                .build();
    }

    /**
     * Spiel 2: Niederlage gegen Player Two <br/>
     * 7 Darts <br/>
     * - 2x T20 <br/>
     * - 1x D20 <br/>
     * - 1x  20 <br/>
     * - 1x D18 <br/>
     * - 1x  17 <br/>
     * - 1x T 2 <br/>
     * Checkout: 0/2
     */
    private GameEntity game2NiederlagePlayerTwo() throws ParseException {
        return new GameEntityBuilder()
                .id("2-niederlage-player-two")
                .userId(LOGGED_IN_ID)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(201)
                .player(LOGGED_IN_ID)
                .player(PLAYER_TWO_ID)
                .timestamp(dateFormatDateTime.parse("03.03.2003 03:03:03").getTime())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 1: 60
                        .dart(new DartDocumentBuilder().value(20).multiplier(2).build()) // 1: 100
                        .dart(new DartDocumentBuilder().value(20).build()) // 1: 120
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 2: 60
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 2: 120
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 2: 180
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).build()) // 1: 137
                        .dart(new DartDocumentBuilder().value(18).multiplier(2).build()) // 1: 173
                        .dart(new DartDocumentBuilder().value(2).multiplier(3).build()) // 1: 179
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(0).build()) // 2: 180
                        .dart(new DartDocumentBuilder().value(0).build()) // 2: 180
                        .dart(new DartDocumentBuilder().value(0).build()) // 2: 180
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 1: 179 (Überworfen)
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(7).multiplier(3).build()) // 2: 201
                        .build())
                .build();
    }

    /**
     * Spiel 3: Sieg gegen Player Three <br/>
     * 4 Darts <br/>
     * - 1x D25 <br/>
     * - 2x T20 <br/>
     * - 1x T17 <br/>
     * Checkout: 1/1
     */
    private GameEntity game3SiegPlayerThree() throws ParseException {
        return new GameEntityBuilder()
                .id("3-sieg-player-three")
                .userId(LOGGED_IN_ID)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .player(LOGGED_IN_ID)
                .player(PLAYER_THREE_ID)
                .timestamp(dateFormatDateTime.parse("04.04.2004 04:04:04").getTime())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 60
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 0 (Überworfen)
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder().build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).multiplier(3).build()) // 51
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 101
                        .build())
                .build();
    }

    /**
     * Spiel 4: Sieg gegen unregistriert <br/>
     * 2 Darts <br/>
     * - 1x D25 <br/>
     * - 1x T17 <br/>
     * Checkout: 1/1
     */
    private GameEntity game4SiegUnregistriert() throws ParseException {
        return new GameEntityBuilder()
                .id("4-sieg-unregistriert")
                .userId(LOGGED_IN_ID)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .player(LOGGED_IN_ID)
                .player(null)
                .timestamp(dateFormatDateTime.parse("05.05.2005 05:05:05").getTime())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).multiplier(3).build()) // 51
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 101
                        .build())
                .build();
    }

    /**
     * Spiel 5: Sieg gegen unregistriert  <br/>
     * Double-In <br/>
     * 7 Darts <br/>
     * - 2x D25 <br/>
     * - 1x T20 <br/>
     * - 1x T17 <br/>
     * - 3x   1 <br/>
     * Checkout: 1/1 <br/>
     * Checkin: 1/4
     */
    private GameEntity game5SiegUnregistriertDoubleIn() throws ParseException {
        return new GameEntityBuilder()
                .id("5-sieg-unregistriert-double-in")
                .userId(LOGGED_IN_ID)
                .checkInMode(CheckInMode.DOUBLE_IN)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .player(LOGGED_IN_ID)
                .player(null)
                .timestamp(dateFormatDateTime.parse("06.06.2006 06:06:06").getTime())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(1).multiplier(1).build()) // 0
                        .dart(new DartDocumentBuilder().value(1).multiplier(1).build()) // 0
                        .dart(new DartDocumentBuilder().value(1).multiplier(1).build()) // 0
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder().build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 50
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 0 (überworfen)
                        .build())
                .aufnahme(new AufnahmeDocumentBuilder().build())
                .aufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).multiplier(3).build()) // 51
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 101
                        .build())
                .build();
    }

}