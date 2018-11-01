package de.pheru.darts.backend.testutil;

import de.pheru.darts.backend.entities.AufnahmeDocument;
import de.pheru.darts.backend.entities.PlayerDocument;

import java.util.ArrayList;

public class PlayerDocumentBuilder {

    private final PlayerDocument document = new PlayerDocument();

    public PlayerDocumentBuilder() {
        document.setAufnahmen(new ArrayList<>());
    }

    public PlayerDocumentBuilder id(final String id) {
        document.setId(id);
        return this;
    }

    public PlayerDocumentBuilder aufnahme(final AufnahmeDocument aufnahmeDocument) {
        document.getAufnahmen().add(aufnahmeDocument);
        return this;
    }

    public PlayerDocument build() {
        return document;
    }

}
