package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.statistics.*;
import de.pheru.darts.backend.entities.CheckInMode;
import de.pheru.darts.backend.entities.CheckOutMode;
import de.pheru.darts.backend.entities.UserEntity;
import de.pheru.darts.backend.testutil.AufnahmeDocumentBuilder;
import de.pheru.darts.backend.testutil.DartDocumentBuilder;
import de.pheru.darts.backend.testutil.GameEntityBuilder;
import de.pheru.darts.backend.util.ReservedUser;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Map;

import static org.junit.Assert.*;

public class StatisticControllerTest extends ControllerTest {

    private final DateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");

    private StatisticController statisticController;

    @Before
    public void setUp() {
        statisticController = new StatisticController(gamesRepository, userRepository);
    }

    @Test
    public void get() throws Exception {
        final UserEntity savedUser = userRepository.save(createDefaultUserEntity());

        /*
        T1: Trainingsspiel
        2 Darts
        - 1x D25
        - 1x T17
        Checkout: 1/1
         */
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .training(true)
                .player(LOGIN_ID)
                .timestamp(dateFormat.parse("01.01.2001 01:00:00").getTime())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).multiplier(3).build()) // 51
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 101
                        .build())
                .build());

        /*
        1: Sieg gegen saved
        6 Darts
        - 3x  20
        - 1x D15
        - 1x  10
        - 1x   1
        - Checkout: 1/2
         */
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .player(LOGIN_ID)
                .player(savedUser.getId())
                .timestamp(dateFormat.parse("02.02.2002 22:22:22").getTime())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).build()) // 20
                        .dart(new DartDocumentBuilder().value(20).build()) // 40
                        .dart(new DartDocumentBuilder().value(20).build()) // 60
                        .build())
                .neueAufnahme(new AufnahmeDocumentBuilder().build())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(1).build()) // 61
                        .dart(new DartDocumentBuilder().value(10).build()) // 71
                        .dart(new DartDocumentBuilder().value(15).multiplier(2).build()) // 101
                        .build())
                .build());

        /*
        2: Niederlage gegen saved
        7 Darts
        - 2x T20
        - 1x D20
        - 1x  20
        - 1x D18
        - 1x  17
        - 1x T 2
        Checkout: 0/2
         */
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .checkOutMode(CheckOutMode.SINGLE_OUT)
                .score(201)
                .player(LOGIN_ID)
                .player(savedUser.getId())
                .timestamp(dateFormat.parse("11.11.2011 11:11:11").getTime())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 1: 60
                        .dart(new DartDocumentBuilder().value(20).multiplier(2).build()) // 1: 100
                        .dart(new DartDocumentBuilder().value(20).build()) // 1: 120
                        .build())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 2: 60
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 2: 120
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 2: 180
                        .build())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).build()) // 1: 137
                        .dart(new DartDocumentBuilder().value(18).multiplier(2).build()) // 1: 173
                        .dart(new DartDocumentBuilder().value(2).multiplier(3).build()) // 1: 179
                        .build())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(0).build()) // 2: 180
                        .dart(new DartDocumentBuilder().value(0).build()) // 2: 180
                        .dart(new DartDocumentBuilder().value(0).build()) // 2: 180
                        .build())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 1: 179 (Überworfen)
                        .build())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(7).multiplier(3).build()) // 2: 201
                        .build())
                .build());

        /*
        3: Sieg gegen gelöschter User
        4 Darts
        - 1x D25
        - 2x T20
        - 1x T17
        Checkout: 1/1
         */
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .player(LOGIN_ID)
                .player("gibtesnichtmehrweilgelöscht")
                .timestamp(dateFormat.parse("31.12.2111 23:59:00").getTime())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 60
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 0 (Überworfen)
                        .build())
                .neueAufnahme(new AufnahmeDocumentBuilder().build())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).multiplier(3).build()) // 51
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 101
                        .build())
                .build());

        /*
        4: Sieg gegen unregistriert
        2 Darts
        - 1x D25
        - 1x T17
        Checkout: 1/1
         */
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .player(LOGIN_ID)
                .player(null)
                .timestamp(dateFormat.parse("15.05.2015 05:15:00").getTime())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).multiplier(3).build()) // 51
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 101
                        .build())
                .build());

        /*
        5: Double-In
        7 Darts
        - 2x D25
        - 1x T20
        - 1x T17
        - 3x   1
        Checkout: 1/1
        Checkin: 1/4
         */
        gamesRepository.save(new GameEntityBuilder()
                .userId(LOGIN_ID)
                .checkInMode(CheckInMode.DOUBLE_IN)
                .checkOutMode(CheckOutMode.DOUBLE_OUT)
                .score(101)
                .player(LOGIN_ID)
                .player(null)
                .timestamp(dateFormat.parse("01.01.2001 01:00:00").getTime())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(1).multiplier(1).build()) // 0
                        .dart(new DartDocumentBuilder().value(1).multiplier(1).build()) // 0
                        .dart(new DartDocumentBuilder().value(1).multiplier(1).build()) // 0
                        .build())
                .neueAufnahme(new AufnahmeDocumentBuilder().build())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 50
                        .dart(new DartDocumentBuilder().value(20).multiplier(3).build()) // 0 (überworfen)
                        .build())
                .neueAufnahme(new AufnahmeDocumentBuilder().build())
                .neueAufnahme(new AufnahmeDocumentBuilder()
                        .dart(new DartDocumentBuilder().value(17).multiplier(3).build()) // 51
                        .dart(new DartDocumentBuilder().value(25).multiplier(2).build()) // 101
                        .build())
                .build());

        final StatisticDto statistics = statisticController.get();
        final DartStatisticDto dartStatistics = statistics.getDarts();
        final Map<Integer, DartCountStatisticDto> countsPerScore = dartStatistics.getCountsPerScore();
        final GameStatisticDto gamesStatistics = statistics.getGames();
        final Map<String, GameCountStatisticDto> countsPerPlayer = gamesStatistics.getCountsPerPlayer();

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


        assertEquals(4, gamesStatistics.getWonCount().longValue());
        assertEquals(1, gamesStatistics.getLostCount().longValue());
        assertEquals(1, countsPerPlayer.get(savedUser.getName()).getWonCount().longValue());
        assertEquals(1, countsPerPlayer.get(savedUser.getName()).getLostCount().longValue());
        assertEquals(2, countsPerPlayer.get(ReservedUser.UNREGISTERED_USER.getName()).getWonCount().longValue());
        assertEquals(0, countsPerPlayer.get(ReservedUser.UNREGISTERED_USER.getName()).getLostCount().longValue());
        assertEquals(1, countsPerPlayer.get(ReservedUser.DELETED_USER.getName()).getWonCount().longValue());
        assertEquals(0, countsPerPlayer.get(ReservedUser.DELETED_USER.getName()).getLostCount().longValue());
    }

    private void assertDartCount(final DartCountStatisticDto dartStatistic, final long singleCount, final long doubleCount, final long tripleCount) {
        assertEquals(singleCount, dartStatistic.getSingleCount().longValue());
        assertEquals(doubleCount, dartStatistic.getDoubleCount().longValue());
        assertEquals(tripleCount, dartStatistic.getTripleCount().longValue());
    }

    @Test
    public void getNoGamesPlayed() {
        final StatisticDto statistics = statisticController.get();
        final DartStatisticDto dartStatistics = statistics.getDarts();
        final Map<Integer, DartCountStatisticDto> countsPerScore = dartStatistics.getCountsPerScore();
        final GameStatisticDto gamesStatistics = statistics.getGames();
        final Map<String, GameCountStatisticDto> countsPerPlayer = gamesStatistics.getCountsPerPlayer();

        assertEquals(0, dartStatistics.getTotalCount().longValue());
        assertEquals(0, dartStatistics.getPossibleCheckoutCount().longValue());
        assertEquals(0, dartStatistics.getCheckoutCount().longValue());
        assertTrue(countsPerScore.isEmpty());


        assertEquals(0, gamesStatistics.getWonCount().longValue());
        assertEquals(0, gamesStatistics.getLostCount().longValue());
        assertTrue(countsPerPlayer.isEmpty());
    }

}