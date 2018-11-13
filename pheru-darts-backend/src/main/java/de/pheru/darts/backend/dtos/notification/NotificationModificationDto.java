package de.pheru.darts.backend.dtos.notification;

import java.util.List;

public class NotificationModificationDto {

    private List<String> ids;
    private boolean read;

    public List<String> getIds() {
        return ids;
    }

    public void setIds(final List<String> ids) {
        this.ids = ids;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(final boolean read) {
        this.read = read;
    }
}