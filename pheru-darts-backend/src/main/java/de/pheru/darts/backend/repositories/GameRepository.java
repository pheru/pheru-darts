package de.pheru.darts.backend.repositories;

import de.pheru.darts.backend.entities.game.GameEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface GameRepository extends CrudRepository<GameEntity, String> {

    List<GameEntity> findByUserId(final String userId);

    List<GameEntity> deleteAllByUserId(final String userId);
}