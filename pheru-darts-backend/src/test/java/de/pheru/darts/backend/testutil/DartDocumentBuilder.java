package de.pheru.darts.backend.testutil;

import de.pheru.darts.backend.entities.DartDocument;

public class DartDocumentBuilder {

    private final DartDocument document = new DartDocument();

    public DartDocumentBuilder(){
        document.setMultiplier(1);
    }

    public DartDocumentBuilder value(final int value) {
        document.setValue(value);
        return this;
    }

    public DartDocumentBuilder multiplier(final int multiplier) {
        document.setMultiplier(multiplier);
        return this;
    }

    public DartDocument build() {
        return document;
    }
}
