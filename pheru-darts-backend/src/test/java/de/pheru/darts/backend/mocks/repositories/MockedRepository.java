package de.pheru.darts.backend.mocks.repositories;


public class MockedRepository {

    private int idCount = 0;

    protected int increaseAndGetId() {
        idCount++;
        return idCount;
    }

    protected String increaseAndGetIdAsString() {
        return String.valueOf(increaseAndGetId());
    }
}