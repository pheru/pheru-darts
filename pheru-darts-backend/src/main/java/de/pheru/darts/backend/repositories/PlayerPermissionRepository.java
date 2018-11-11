package de.pheru.darts.backend.repositories;

import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PlayerPermissionRepository extends CrudRepository<PlayerPermissionEntity, String> {

    List<PlayerPermissionEntity> findByUserId(final String userId);

    List<PlayerPermissionEntity> findByPermittedUserId(final String permittedUserId);

    @EnableScan
    PlayerPermissionEntity findByUserIdAndPermittedUserId(final String userId, final String permittedUserId);

    void deleteAllByUserId(final String userId);

    void deleteAllByPermittedUserId(final String permittedUserId);
}
