package de.pheru.darts.backend.dtos;

public class PlayerDto {

    private String id;
    private DartDto[][] aufnahmen;

    public String getId() {
        return id;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public DartDto[][] getAufnahmen() {
        return aufnahmen;
    }

    public void setAufnahmen(final DartDto[][] aufnahmen) {
        this.aufnahmen = aufnahmen;
    }
}
