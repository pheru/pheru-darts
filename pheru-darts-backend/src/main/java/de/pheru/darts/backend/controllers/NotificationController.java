package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.notification.NotificationDto;
import de.pheru.darts.backend.dtos.notification.NotificationModificationDto;
import de.pheru.darts.backend.entities.notification.NotificationEntity;
import de.pheru.darts.backend.exceptions.ForbiddenException;
import de.pheru.darts.backend.mappers.EntityMapper;
import de.pheru.darts.backend.repositories.NotificationRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    private static final Logger LOGGER = new Logger();

    private final NotificationRepository notificationRepository;

    public NotificationController(final NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<NotificationDto> get() {
        final List<NotificationEntity> notifications = notificationRepository.findByUserIdOrderByTimestamp(SecurityUtil.getLoggedInUserId());
        return EntityMapper.toNotificationDto(notifications);
    }

    @PutMapping
    public List<NotificationDto> put(@RequestBody final NotificationModificationDto notificationModification) {
        final List<String> ids = notificationModification.getIds();
        final List<NotificationEntity> notifications = notificationRepository.findAll(ids);

        checkUserIds(notifications);

        for (final NotificationEntity notification : notifications) {
            notification.setRead(notificationModification.isRead());
        }
        final Iterable<NotificationEntity> savedNotifications = notificationRepository.save(notifications);

        final List<NotificationEntity> savedNotificationsList = new ArrayList<>();
        savedNotifications.forEach(savedNotificationsList::add);
        return EntityMapper.toNotificationDto(savedNotificationsList);
    }

    private void checkUserIds(final List<NotificationEntity> notifications) {
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        for (final NotificationEntity notification : notifications) {
            if (!notification.getUserId().equals(loggedInUserId)) {
                final String msg = "Not allowed to modify notification.";
                LOGGER.warn(msg + " notification-id: " + notification.getId() + ", user-id: " + loggedInUserId);
                throw new ForbiddenException(msg);
            }
        }
    }

}