package de.pheru.darts.backend.repositories;

import de.pheru.darts.backend.entities.GameEntity;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface GamesRepository extends CrudRepository<GameEntity, String> {

    List<GameEntity> findByUserId(final String userId);

    // TODO Testmethoden
    @Override
    @EnableScan
    void deleteAll();
    @Override
    @EnableScan
    List<GameEntity> findAll();
}
