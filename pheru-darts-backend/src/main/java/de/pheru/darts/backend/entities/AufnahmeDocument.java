package de.pheru.darts.backend.entities;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

import java.util.List;

@DynamoDBDocument
public class AufnahmeDocument {

    @DynamoDBAttribute
    private List<DartDocument> darts;

    public List<DartDocument> getDarts() {
        return darts;
    }

    public void setDarts(final List<DartDocument> darts) {
        this.darts = darts;
    }
}
