package de.pheru.darts.backend.entities.notification;

public final class NotificationTemplates {

    private NotificationTemplates() {
        //Utility-Klasse
    }

    public static NotificationEntity gameSaved(final String userId, final long timestamp,
                                               final String gameCreatorName) {
        return notification(userId, NotificationType.GAME_SAVED, timestamp,
                "\"" + gameCreatorName + "\" hat ein Spiel mit Dir gespeichert.");
    }

    public static NotificationEntity permissionGranted(final String userId, final long timestamp,
                                                       final String permittingUserName) {
        return notification(userId, NotificationType.PLAYERPERMISSION_GRANTED, timestamp,
                "\"" + permittingUserName + "\" hat Dich berechtigt, Spiele mit ihr/ihm zu erstellen.");
    }

    public static NotificationEntity permissionRemoved(final String userId, final long timestamp,
                                                       final String permittingUserName) {
        return notification(userId, NotificationType.PLAYERPERMISSION_REMOVED, timestamp,
                "\"" + permittingUserName + "\" hat Dir die Berechtigung genommen, Spiele mit ihr/ihm zu erstellen.");
    }

    private static NotificationEntity notification(final String userId, final NotificationType type,
                                                   final long timestamp, final String message) {
        final NotificationEntity notification = new NotificationEntity();
        notification.setNotificationType(type);
        notification.setUserId(userId);
        notification.setRead(false);
        notification.setTimestamp(timestamp);
        notification.setMessage(message);
        return notification;
    }

}