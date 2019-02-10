package de.pheru.darts.backend.util;

public enum ReservedUser {

    PHERU_DARTS("reserved_1", "Pheru-Darts"),
    UNREGISTERED_USERS("reserved_2", "Unregistrierte Benutzer"),
    DELETED_USERS("reserved_4", "Gelöschte Benutzer");

    private final String id;
    private final String name;

    ReservedUser(final String id, final String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}