package de.pheru.darts.backend.dtos;

public class DartDto {

    private int multiplier;
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
