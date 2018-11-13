package de.pheru.darts.backend.controllers;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ServerInformationControllerTest {

    private static final String VERSION = "1.2.3-SUPER-FINAL";

    private ServerInformationController serverInformationController;

    @Before
    public void setUp() {
        serverInformationController = new ServerInformationController(VERSION);
    }

    @Test
    public void publicInformation() {
        final String publicInformation = serverInformationController.publicInformation();
        assertEquals(VERSION, publicInformation);
    }
}