package de.pheru.darts.backend.entities.game;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class DartDocument {

    @DynamoDBAttribute
    private int multiplier;
    @DynamoDBAttribute
    private int value;

    public int getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(final int multiplier) {
        this.multiplier = multiplier;
    }

    public int getValue() {
        return value;
    }

    public void setValue(final int value) {
        this.value = value;
    }
}
