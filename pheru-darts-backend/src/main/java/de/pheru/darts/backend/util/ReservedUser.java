package de.pheru.darts.backend.util;

public enum ReservedUser {

    UNREGISTERED_USERS("Unregistrierte Benutzer"),
    DELETED_USERS("Gelöschte Benutzer");

    private final String name;

    ReservedUser(final String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
