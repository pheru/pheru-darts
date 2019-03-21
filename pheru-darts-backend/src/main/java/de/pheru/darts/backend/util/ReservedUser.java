package de.pheru.darts.backend.util;

public enum ReservedUser {

    PHERU_DARTS("reserved_1", "Pheru-Darts"),
    UNREGISTERED_USER("reserved_2", "Unregistrierter Benutzer"),
    DELETED_USER("reserved_4", "Gelöschter Benutzer"),
    TRAINING("reserved_8", "Training");

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