package de.pheru.darts.backend.mocks.repositories;


import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;

import java.util.ArrayList;
import java.util.List;

public class MockedPlayerPermissionRepository implements PlayerPermissionRepository {

    private int idCount = 0;
    private final List<PlayerPermissionEntity> playerPermissions = new ArrayList<>();

    @Override
    public List<PlayerPermissionEntity> findByUserId(final String userId) {
        final List<PlayerPermissionEntity> byUserId = new ArrayList<>();
        for (final PlayerPermissionEntity playerPermission : playerPermissions) {
            if (playerPermission.getUserId().equals(userId)) {
                byUserId.add(playerPermission);
            }
        }
        return byUserId;
    }

    @Override
    public List<PlayerPermissionEntity> findByPermittedUserId(final String permittedUserId) {
        final List<PlayerPermissionEntity> byUserId = new ArrayList<>();
        for (final PlayerPermissionEntity playerPermission : playerPermissions) {
            if (playerPermission.getPermittedUserId().equals(permittedUserId)) {
                byUserId.add(playerPermission);
            }
        }
        return byUserId;
    }

    @Override
    public PlayerPermissionEntity findByUserIdAndPermittedUserId(final String userId, final String permittedUserId) {
        for (final PlayerPermissionEntity playerPermission : playerPermissions) {
            if (playerPermission.getUserId().equals(userId) && playerPermission.getPermittedUserId().equals(permittedUserId)) {
                return playerPermission;
            }
        }
        return null;
    }

    @Override
    public List<PlayerPermissionEntity> deleteAllByUserId(final String userId) {
        for (final PlayerPermissionEntity savedEntity : new ArrayList<>(playerPermissions)) {
            if(savedEntity.getUserId().equals(userId)){
                playerPermissions.remove(savedEntity);
            }
        }
        return null;
    }

    @Override
    public List<PlayerPermissionEntity> deleteAllByPermittedUserId(final String permittedUserId) {
        for (final PlayerPermissionEntity savedEntity : new ArrayList<>(playerPermissions)) {
            if(savedEntity.getPermittedUserId().equals(permittedUserId)){
                playerPermissions.remove(savedEntity);
            }
        }
        return null;
    }

    @Override
    public <S extends PlayerPermissionEntity> S save(final S s) {
        playerPermissions.add(s);
        s.setId(String.valueOf(idCount));
        idCount++;
        return s;
    }

    @Override
    public <S extends PlayerPermissionEntity> Iterable<S> save(final Iterable<S> iterable) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public PlayerPermissionEntity findOne(final String s) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public boolean exists(final String s) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public Iterable<PlayerPermissionEntity> findAll() {
        return playerPermissions;
    }

    @Override
    public Iterable<PlayerPermissionEntity> findAll(final Iterable<String> iterable) {
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
    public void delete(final PlayerPermissionEntity playerPermissionEntity) {
        for (final PlayerPermissionEntity savedEntity : new ArrayList<>(playerPermissions)) {
            if(savedEntity.getId().equals(playerPermissionEntity.getId())){
                playerPermissions.remove(savedEntity);
            }
        }
    }

    @Override
    public void delete(final Iterable<? extends PlayerPermissionEntity> iterable) {
        throw new UnsupportedOperationException("Not implemented");
    }

    @Override
    public void deleteAll() {
        throw new UnsupportedOperationException("Not implemented");
    }
}