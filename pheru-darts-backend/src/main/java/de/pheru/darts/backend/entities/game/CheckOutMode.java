package de.pheru.darts.backend.entities.game;

public enum CheckOutMode {
    SINGLE_OUT, DOUBLE_OUT, MASTER_OUT;

    public static CheckOutMode forString(final String s) {
        switch (s) {
            case "SINGLE_OUT":
                return SINGLE_OUT;
            case "DOUBLE_OUT":
                return DOUBLE_OUT;
            case "MASTER_OUT":
                return MASTER_OUT;
            default:
                throw new IllegalArgumentException("No CheckOutMode for String " + s);
        }
    }
}
