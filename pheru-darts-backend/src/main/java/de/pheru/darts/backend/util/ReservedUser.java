package de.pheru.darts.backend.util;

public enum ReservedUser {

    UNREGISTERED_USER("Unregistrierter Benutzer"),
    DELETED_USER("Gelöschter Benutzer");

    private final String name;

    ReservedUser(final String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
