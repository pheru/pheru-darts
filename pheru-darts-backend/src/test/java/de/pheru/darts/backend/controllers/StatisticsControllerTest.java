package de.pheru.darts.backend.controllers;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.fail;

public class StatisticsControllerTest extends ControllerTest {

    private StatisticsController statisticsController;

    @Before
    public void setUp() {
        statisticsController = new StatisticsController(gamesRepository, userRepository);
    }

    @Test
    public void get() {
        fail("Not implemented");
    }

    @Test
    public void getNoGamesPlayed() {
        fail("Not implemented");
    }

    @Test
    public void getGameWithDeletedUser() {
        fail("Not implemented");
    }

}