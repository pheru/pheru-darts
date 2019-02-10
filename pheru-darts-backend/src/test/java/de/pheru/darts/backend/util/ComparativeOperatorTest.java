package de.pheru.darts.backend.util;

import org.junit.Test;

import static org.junit.Assert.*;

public class ComparativeOperatorTest {

    @Test
    public void forString() {
        assertEquals(ComparativeOperator.EQUAL, ComparativeOperator.forString("="));
        assertEquals(ComparativeOperator.GREATER, ComparativeOperator.forString(">"));
        assertEquals(ComparativeOperator.GREATER_OR_EQUAL, ComparativeOperator.forString(">="));
        assertEquals(ComparativeOperator.LESS, ComparativeOperator.forString("<"));
        assertEquals(ComparativeOperator.LESS_OR_EQUAL, ComparativeOperator.forString("<="));
    }

    @Test
    public void equal() {
        final ComparativeOperator.ComparativeMatcher equalMatcher =
                ComparativeOperator.EQUAL.getComparativeMatcher();
        assertTrue(equalMatcher.match(1, 1));
        assertFalse(equalMatcher.match(2, 1));
        assertFalse(equalMatcher.match(1, 2));
    }

    @Test
    public void greater() {
        final ComparativeOperator.ComparativeMatcher greaterMatcher =
                ComparativeOperator.GREATER.getComparativeMatcher();
        assertFalse(greaterMatcher.match(1, 1));
        assertTrue(greaterMatcher.match(2, 1));
        assertFalse(greaterMatcher.match(1, 2));
    }

    @Test
    public void greaterOrEqual() {
        final ComparativeOperator.ComparativeMatcher greaterEqualMatcher =
                ComparativeOperator.GREATER_OR_EQUAL.getComparativeMatcher();
        assertTrue(greaterEqualMatcher.match(1, 1));
        assertTrue(greaterEqualMatcher.match(2, 1));
        assertFalse(greaterEqualMatcher.match(1, 2));
    }

    @Test
    public void less() {
        final ComparativeOperator.ComparativeMatcher lessMatcher =
                ComparativeOperator.LESS.getComparativeMatcher();
        assertFalse(lessMatcher.match(1, 1));
        assertFalse(lessMatcher.match(2, 1));
        assertTrue(lessMatcher.match(1, 2));
    }

    @Test
    public void lessOrEqual() {
        final ComparativeOperator.ComparativeMatcher lessEqualMatcher =
                ComparativeOperator.LESS_OR_EQUAL.getComparativeMatcher();
        assertTrue(lessEqualMatcher.match(1, 1));
        assertFalse(lessEqualMatcher.match(2, 1));
        assertTrue(lessEqualMatcher.match(1, 2));
    }
}