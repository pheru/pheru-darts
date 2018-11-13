package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.notification.NotificationDto;
import de.pheru.darts.backend.dtos.notification.NotificationModificationDto;
import de.pheru.darts.backend.entities.notification.NotificationEntity;
import de.pheru.darts.backend.exceptions.ForbiddenException;
import org.junit.Before;
import org.junit.Test;

import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;

public class NotificationControllerTest extends ControllerTest {

    private NotificationController notificationController;

    @Before
    public void setUp() {
        notificationController = new NotificationController(notificationRepository);
    }

    @Test
    public void get() {
        final String message = "Tolle message";

        final NotificationEntity savedNotification = new NotificationEntity();
        savedNotification.setUserId(LOGIN_ID);
        savedNotification.setMessage(message);

        notificationRepository.save(savedNotification);

        final List<NotificationDto> notifications = notificationController.get();
        assertEquals(1, notifications.size());
        assertEquals(message, notifications.get(0).getMessage());
    }

    @Test
    public void put() {
        NotificationEntity savedNotification = new NotificationEntity();
        savedNotification.setUserId(LOGIN_ID);
        savedNotification.setRead(false);
        savedNotification = notificationRepository.save(savedNotification);

        NotificationEntity savedNotification2 = new NotificationEntity();
        savedNotification2.setUserId(LOGIN_ID);
        savedNotification2.setRead(false);
        savedNotification2 = notificationRepository.save(savedNotification2);

        final NotificationModificationDto modificationDto = new NotificationModificationDto();
        modificationDto.setIds(Collections.singletonList(savedNotification.getId()));
        modificationDto.setRead(true);
        final List<NotificationDto> modificatedNotifications = notificationController.put(modificationDto);

        assertEquals(1, modificatedNotifications.size());
        assertTrue(modificatedNotifications.get(0).isRead());

        final List<NotificationEntity> allAfterPut = (List<NotificationEntity>) notificationRepository.findAll();
        assertEquals(2, allAfterPut.size());
        for (final NotificationEntity notificationEntity : allAfterPut) {
            if (notificationEntity.getId().equals(savedNotification.getId())) {
                assertTrue(notificationEntity.isRead());
            } else if (notificationEntity.getId().equals(savedNotification2.getId())) {
                assertFalse(notificationEntity.isRead());
            } else {
                fail("unknown notification; id=" + notificationEntity.getId());
            }
        }
    }

    @Test
    public void putFailedNotLoggedInUser() {
        NotificationEntity savedNotification = new NotificationEntity();
        savedNotification.setUserId("other-notification-user");
        savedNotification.setRead(false);
        savedNotification = notificationRepository.save(savedNotification);

        final Iterable<NotificationEntity> all = notificationRepository.findAll();
        final NotificationEntity foundNotification = all.iterator().next();
        assertEquals(savedNotification.getId(), foundNotification.getId());
        assertFalse(foundNotification.isRead());

        final NotificationModificationDto modificationDto = new NotificationModificationDto();
        modificationDto.setIds(Collections.singletonList(savedNotification.getId()));
        modificationDto.setRead(true);

        try {
            notificationController.put(modificationDto);
            fail("Exception expected");
        } catch (final ForbiddenException e) {
            final NotificationEntity foundNotificationAfterPut = all.iterator().next();
            assertEquals(savedNotification.getId(), foundNotificationAfterPut.getId());
            assertFalse(foundNotificationAfterPut.isRead());
        }
    }
}