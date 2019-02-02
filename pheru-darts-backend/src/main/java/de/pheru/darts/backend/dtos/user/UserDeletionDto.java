package de.pheru.darts.backend.dtos.user;

public class UserDeletionDto {

    private String currentPassword;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(final String currentPassword) {
        this.currentPassword = currentPassword;
    }
}