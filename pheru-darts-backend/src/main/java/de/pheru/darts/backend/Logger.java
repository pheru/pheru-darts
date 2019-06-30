package de.pheru.darts.backend;

/**
 * Temporärer Ersatz bis richtiges Logging implementiert
 */
public class Logger {

    private final Class clazz;

    public Logger(final Class clazz) {
        this.clazz = clazz;
    }

    public void debug(final String s) {
        System.out.println("DEBUG|" + clazz.getSimpleName() + ": " + s);
    }

    public void info(final String s) {
        System.out.println("INFO|" + clazz.getSimpleName() + ": " + s);
    }

    public void warn(final String s) {
        System.out.println("WARN|" + clazz.getSimpleName() + ": " + s);
    }

    public void warn(final String s, final Throwable e) {
        System.out.println("WARN|" + clazz.getSimpleName() + ": " + s);
        e.printStackTrace();
    }

    public void error(final String s) {
        System.out.println("ERROR|" + clazz.getSimpleName() + ": " + s);
    }

    public void error(final String s, final Throwable e) {
        System.out.println("ERROR: " + s);
        e.printStackTrace();
    }

}
