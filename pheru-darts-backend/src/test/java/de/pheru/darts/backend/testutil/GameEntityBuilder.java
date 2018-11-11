package de.pheru.darts.backend.testutil;

import de.pheru.darts.backend.entities.AufnahmeDocument;
import de.pheru.darts.backend.entities.CheckInMode;
import de.pheru.darts.backend.entities.CheckOutMode;
import de.pheru.darts.backend.entities.GameEntity;

import java.util.ArrayList;

public class GameEntityBuilder {

    private final GameEntity entity = new GameEntity();
    private int currentPlayer = 0;

    public GameEntityBuilder() {
        entity.setPlayers(new ArrayList<>());
    }

    public GameEntityBuilder id(final String id) {
        entity.setId(id);
        return this;
    }

    public GameEntityBuilder userId(final String userId) {
        entity.setUserId(userId);
        return this;
    }

    public GameEntityBuilder score(final int score) {
        entity.setScore(score);
        return this;
    }

    public GameEntityBuilder checkInMode(final CheckInMode checkInMode) {
        entity.setCheckInMode(checkInMode);
        return this;
    }

    public GameEntityBuilder checkOutMode(final CheckOutMode checkOutMode) {
        entity.setCheckOutMode(checkOutMode);
        return this;
    }

    public GameEntityBuilder training(final boolean training) {
        entity.setTraining(training);
        return this;
    }

    public GameEntityBuilder timestamp(final Long timestamp) {
        entity.setTimestamp(timestamp);
        return this;
    }

    public GameEntityBuilder player(final String playerId) {
        entity.getPlayers().add(new PlayerDocumentBuilder().id(playerId).build());
        return this;
    }

    public GameEntityBuilder neueAufnahme(final AufnahmeDocument aufnahmeDocument) {
        entity.getPlayers().get(currentPlayer).getAufnahmen().add(aufnahmeDocument);
        currentPlayer++;
        if (currentPlayer >= entity.getPlayers().size()) {
            currentPlayer = 0;
        }
        return this;
    }

    public GameEntity build() {
        return entity;
    }
}
