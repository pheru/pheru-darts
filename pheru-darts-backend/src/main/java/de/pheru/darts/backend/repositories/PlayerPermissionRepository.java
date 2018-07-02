package de.pheru.darts.backend.repositories;

import de.pheru.darts.backend.entities.PlayerPermissionEntity;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PlayerPermissionRepository extends CrudRepository<PlayerPermissionEntity, String> {

    List<PlayerPermissionEntity> findByUserId(final String userId);

    List<PlayerPermissionEntity> findByPermittedUserId(final String permittedUserId);

    @EnableScan
    PlayerPermissionEntity findByUserIdAndPermittedUserId(final String userId, final String permittedUserId);


    // TODO Testmethoden
    @Override
    @EnableScan
    void deleteAll();
    @Override
    @EnableScan
    List<PlayerPermissionEntity> findAll();
}
