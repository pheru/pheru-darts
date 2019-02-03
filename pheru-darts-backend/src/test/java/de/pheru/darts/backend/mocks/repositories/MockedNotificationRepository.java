package de.pheru.darts.backend.mocks.repositories;


import de.pheru.darts.backend.entities.notification.NotificationEntity;
import de.pheru.darts.backend.repositories.NotificationRepository;

import java.util.ArrayList;
import java.util.List;

public class MockedNotificationRepository extends MockedRepository implements NotificationRepository {

    private final List<NotificationEntity> notifications = new ArrayList<>();

    @Override
    public List<NotificationEntity> findByUserIdOrderByTimestamp(final String userId) {
        final List<NotificationEntity> byUserId = new ArrayList<>();
        for (final NotificationEntity notification : notifications) {
            if (notification.getUserId().equals(userId)) {
                byUserId.add(notification);
            }
        }
        return byUserId;
    }

    @Override
    public List<NotificationEntity> findAll(final Iterable<String> ids) {
        final List<NotificationEntity> byId = new ArrayList<>();
        for (final NotificationEntity notification : notifications) {
            for (final String id : ids) {
                if (notification.getId().equals(id)) {
                    byId.add(notification);
                }
            }
        }
        return byId;
    }

    @Override
    public List<NotificationEntity> deleteAllByUserId(final String userId) {
        for (final NotificationEntity notification : new ArrayList<>(notifications)) {
            if (notification.getUserId().equals(userId)) {
                notifications.remove(notification);
            }
        }
        return null;
    }

    @Override
    public Iterable<NotificationEntity> findAll() {
        return notifications;
    }

    @Override
    public <S extends NotificationEntity> S save(final S entity) {
        NotificationEntity alreadySaved = null;
        for (final NotificationEntity notification : notifications) {
            if (notification.getId().equals(entity.getId())) {
                alreadySaved = notification;
            }
        }
        if (alreadySaved != null) {
            entity.setId(alreadySaved.getId());
            notifications.remove(alreadySaved);
        } else {
            entity.setId(increaseAndGetIdAsString());
        }
        notifications.add(entity);
        return entity;
    }

    @Override
    public <S extends NotificationEntity> Iterable<S> save(final Iterable<S> entities) {
        final List<S> saved = new ArrayList<>();
        for (final S entity : entities) {
            saved.add(save(entity));
        }
        return saved;
    }

    @Override
    public NotificationEntity findOne(final String s) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public boolean exists(final String s) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public long count() {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public void delete(final String s) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public void delete(final NotificationEntity entity) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public void delete(final Iterable<? extends NotificationEntity> entities) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public void deleteAll() {
        throw new UnsupportedOperationException("Not implemented");
    }
}