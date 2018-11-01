package de.pheru.darts.backend.testutil;

import de.pheru.darts.backend.entities.AufnahmeDocument;
import de.pheru.darts.backend.entities.DartDocument;

import java.util.ArrayList;

public class AufnahmeDocumentBuilder {

    private final AufnahmeDocument document = new AufnahmeDocument();

    public AufnahmeDocumentBuilder() {
        document.setDarts(new ArrayList<>());
    }

    public AufnahmeDocumentBuilder dart(final DartDocument dartDocument) {
        document.getDarts().add(dartDocument);
        return this;
    }

    public AufnahmeDocument build() {
        return document;
    }

}
