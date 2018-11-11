package de.pheru.darts.backend.entities.game;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

import java.util.List;

@DynamoDBDocument
public class PlayerDocument {

    @DynamoDBAttribute
    private String id;
    @DynamoDBAttribute
    private List<AufnahmeDocument> aufnahmen;

    public String getId() {
        return id;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public List<AufnahmeDocument> getAufnahmen() {
        return aufnahmen;
    }

    public void setAufnahmen(final List<AufnahmeDocument> aufnahmen) {
        this.aufnahmen = aufnahmen;
    }
}
