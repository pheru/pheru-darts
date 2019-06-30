package de.pheru.darts.backend.util;

public enum ComparativeOperator {

    EQUAL("=", (a,b) -> a == b),
    GREATER(">", (a,b) -> a > b),
    GREATER_OR_EQUAL(">=", (a,b) -> a >= b),
    LESS("<", (a,b) -> a < b),
    LESS_OR_EQUAL("<=", (a,b) -> a <= b);

    private final String operator;
    private final ComparativeMatcher comparativeMatcher;

    ComparativeOperator(final String operator, final ComparativeMatcher comparativeMatcher) {
        this.operator = operator;
        this.comparativeMatcher = comparativeMatcher;
    }

    public static ComparativeOperator forString(final String s) {
        for (final ComparativeOperator comparativeOperator : values()) {
            if (comparativeOperator.getOperator().equals(s)) {
                return comparativeOperator;
            }
        }
        throw new IllegalArgumentException("No ComparativeOperator for String " + s);
    }

    public String getOperator() {
        return operator;
    }

    public ComparativeMatcher getComparativeMatcher() {
        return comparativeMatcher;
    }

    public interface ComparativeMatcher {
        boolean match(final long a, final long b);
    }
}