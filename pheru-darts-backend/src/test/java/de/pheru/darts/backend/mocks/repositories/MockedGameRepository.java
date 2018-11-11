package de.pheru.darts.backend.mocks.repositories;


import de.pheru.darts.backend.entities.game.GameEntity;
import de.pheru.darts.backend.repositories.GameRepository;

import java.util.ArrayList;
import java.util.List;

public class MockedGameRepository extends MockedRepository implements GameRepository {

    final List<GameEntity> games = new ArrayList<>();

    @Override
    public List<GameEntity> findByUserId(final String userId) {
        final List<GameEntity> gamesByUserId = new ArrayList<>();
        for (final GameEntity game : games) {
            if (game.getUserId().equals(userId)) {
                gamesByUserId.add(game);
            }
        }
        return gamesByUserId;
    }

    @Override
    public void deleteAllByUserId(final String userId) {
        for (final GameEntity game : new ArrayList<>(games)) {
            if (game.getUserId().equals(userId)) {
                games.remove(game);
            }
        }
    }

    @Override
    public <S extends GameEntity> S save(final S s) {
        games.add(s);
        if (s.getId() == null || s.getId().isEmpty()) {
            s.setId(increaseAndGetIdAsString());
        }
        return s;
    }

    @Override
    public <S extends GameEntity> Iterable<S> save(final Iterable<S> iterable) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public GameEntity findOne(final String s) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public boolean exists(final String s) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public Iterable<GameEntity> findAll() {
        return games;
    }

    @Override
    public Iterable<GameEntity> findAll(final Iterable<String> iterable) {
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
    public void delete(final GameEntity gameEntity) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public void delete(final Iterable<? extends GameEntity> iterable) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public void deleteAll() {
        throw new UnsupportedOperationException("Not implemented");
    }
}