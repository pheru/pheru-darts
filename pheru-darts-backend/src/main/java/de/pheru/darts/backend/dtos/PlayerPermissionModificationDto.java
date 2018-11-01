package de.pheru.darts.backend.dtos;

public class PlayerPermissionModificationDto {

    private String permittedId;
    private String permittedUsername;

    public String getPermittedId() {
        return permittedId;
    }

    public void setPermittedId(final String permittedId) {
        this.permittedId = permittedId;
    }

    public String getPermittedUsername() {
        return permittedUsername;
    }

    public void setPermittedUsername(final String permittedUsername) {
        this.permittedUsername = permittedUsername;
    }
}
