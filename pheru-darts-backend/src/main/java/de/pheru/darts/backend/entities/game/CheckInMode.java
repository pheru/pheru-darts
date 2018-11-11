package de.pheru.darts.backend.entities.game;

public enum CheckInMode {
    SINGLE_IN, DOUBLE_IN;

    public static CheckInMode forString(final String s) {
        switch (s) {
            case "SINGLE_IN":
                return SINGLE_IN;
            case "DOUBLE_IN":
                return DOUBLE_IN;
            default:
                throw new IllegalArgumentException("No CheckOutMode for String " + s);
        }
    }

    public static CheckInMode defaultValue(){
        return SINGLE_IN;
    }
}
