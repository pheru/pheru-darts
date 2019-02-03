package de.pheru.darts.backend.mocks.repositories;


import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;

public class MockedUserRepository extends MockedRepository implements UserRepository {

    private final List<UserEntity> users = new ArrayList<>();

    @Override
    public UserEntity findById(final String id) {
        for (final UserEntity user : users) {
            if (user.getId().equals(id)) {
                return user;
            }
        }
        return null;
    }

    @Override
    public List<UserEntity> findAll(final Iterable<String> ids) {
        final List<UserEntity> users = new ArrayList<>();
        for (final String id : ids) {
            final UserEntity user = findById(id);
            if (user != null) {
                users.add(user);
            }
        }
        return users;
    }

    @Override
    public UserEntity findByName(final String name) {
        for (final UserEntity user : users) {
            if (user.getName().equals(name)) {
                return user;
            }
        }
        return null;
    }

    @Override
    public UserEntity deleteById(final String id) {
        for (final UserEntity savedEntity : new ArrayList<>(users)) {
            if (savedEntity.getId().equals(id)) {
                users.remove(savedEntity);
            }
        }
        return null;
    }

    @Override
    public <S extends UserEntity> S save(final S s) {
        users.add(s);
        if (s.getId() == null || s.getId().isEmpty()) {
            s.setId(increaseAndGetIdAsString());
        }
        return s;
    }

    @Override
    public <S extends UserEntity> Iterable<S> save(final Iterable<S> iterable) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public UserEntity findOne(final String s) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public boolean exists(final String s) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public List<UserEntity> findAll() {
        return users;
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
    public void delete(final UserEntity userEntity) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public void delete(final Iterable<? extends UserEntity> iterable) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public void deleteAll() {
        throw new UnsupportedOperationException("Not implemented");
    }
}