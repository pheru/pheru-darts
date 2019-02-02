package de.pheru.darts.backend.repositories;

import de.pheru.darts.backend.entities.notification.NotificationEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NotificationRepository extends CrudRepository<NotificationEntity, String> {

    List<NotificationEntity> findByUserIdOrderByTimestamp(final String userId);

    List<NotificationEntity> findAll(final Iterable<String> ids);

    List<NotificationEntity> deleteAllByUserId(final String userId);
}