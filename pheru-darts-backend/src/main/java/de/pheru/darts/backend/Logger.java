package de.pheru.darts.backend;

/**
 * Temporärer Ersatz bis richtiges Logging implementiert
 */
public class Logger {

    public void debug(final String s) {
        System.out.println("DEBUG: " + s);
    }

    public void info(final String s) {
        System.out.println("INFO : " + s);
    }

    public void warn(final String s) {
        System.out.println("WARN : " + s);
    }

    public void warn(final String s, final Throwable e) {
        System.out.println("WARN: " + s);
        e.printStackTrace();
    }

    public void error(final String s) {
        System.out.println("ERROR: " + s);
    }

    public void error(final String s, final Throwable e) {
        System.out.println("ERROR: " + s);
        e.printStackTrace();
    }

}
