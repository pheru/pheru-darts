package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.playerpermission.PlayerPermissionModificationDto;
import de.pheru.darts.backend.dtos.user.UserDto;
import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.exceptions.PermissionAlreadyGrantedException;
import de.pheru.darts.backend.exceptions.UserNotFoundException;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

public class PlayerPermissionControllerTest extends ControllerTest {

    private PlayerPermissionController playerPermissionController;

    @Before
    public void setUp() {
        playerPermissionController = new PlayerPermissionController(playerPermissionRepository, userRepository);
    }

    @Test
    public void postWithId() {
        final UserEntity savedUser = userRepository.save(createDefaultUserEntity());
        playerPermissionController.post(createModificationDtoWithId(savedUser.getId()));

        final Iterable<PlayerPermissionEntity> all = playerPermissionRepository.findAll();
        assertTrue(all.iterator().hasNext());

        final PlayerPermissionEntity entity = all.iterator().next();
        assertEquals(LOGIN_ID, entity.getUserId());
        assertEquals(savedUser.getId(), entity.getPermittedUserId());
    }

    @Test
    public void postWithName() {
        final UserEntity savedUser = userRepository.save(createDefaultUserEntity());
        playerPermissionController.post(createModificationDtoWithUserName(savedUser.getName()));

        final Iterable<PlayerPermissionEntity> all = playerPermissionRepository.findAll();
        assertTrue(all.iterator().hasNext());

        final PlayerPermissionEntity entity = all.iterator().next();
        assertEquals(LOGIN_ID, entity.getUserId());
        assertEquals(savedUser.getId(), entity.getPermittedUserId());
    }

    @Test
    public void postWithIdUserDoesNotExist() {
        try {
            playerPermissionController.post(createModificationDtoWithId("gibtsnicht"));
            fail("Exception expected");
        } catch (final UserNotFoundException e) {
            final Iterable<PlayerPermissionEntity> all = playerPermissionRepository.findAll();
            assertFalse(all.iterator().hasNext());
        }
    }

    @Test
    public void postWithUserNameUserDoesNotExist() {
        try {
            playerPermissionController.post(createModificationDtoWithUserName("gibtsnicht"));
            fail("Exception expected");
        } catch (final UserNotFoundException e) {
            final Iterable<PlayerPermissionEntity> all = playerPermissionRepository.findAll();
            assertFalse(all.iterator().hasNext());
        }
    }

    @Test
    public void postPermissionAlreadyGranted() {
        final UserEntity savedUser = userRepository.save(createDefaultUserEntity());
        savePlayerPermission(LOGIN_ID, savedUser.getId());

        try {
            playerPermissionController.post(createModificationDtoWithId(savedUser.getId()));
            fail("Exception expected");
        } catch (final PermissionAlreadyGrantedException e) {
            final List<PlayerPermissionEntity> all = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
            assertEquals(1, all.size());
        }
    }

    @Test
    public void deleteWithId() {
        final UserEntity savedUser = userRepository.save(createDefaultUserEntity());
        savePlayerPermission(LOGIN_ID, savedUser.getId());

        final Iterable<PlayerPermissionEntity> allBefore = playerPermissionRepository.findAll();
        assertTrue(allBefore.iterator().hasNext());

        playerPermissionController.delete(createModificationDtoWithId(savedUser.getId()));

        final Iterable<PlayerPermissionEntity> allAfter = playerPermissionRepository.findAll();
        assertFalse(allAfter.iterator().hasNext());
    }

    @Test
    public void deleteWithUsername() {
        final UserEntity savedUser = userRepository.save(createDefaultUserEntity());
        savePlayerPermission(LOGIN_ID, savedUser.getId());

        final Iterable<PlayerPermissionEntity> allBefore = playerPermissionRepository.findAll();
        assertTrue(allBefore.iterator().hasNext());

        playerPermissionController.delete(createModificationDtoWithUserName(savedUser.getName()));

        final Iterable<PlayerPermissionEntity> allAfter = playerPermissionRepository.findAll();
        assertFalse(allAfter.iterator().hasNext());
    }

    @Test
    public void getPermittedUsers() {
        final UserEntity loggedInUser = createDefaultUserEntity();
        loggedInUser.setId(LOGIN_ID);
        userRepository.save(loggedInUser);
        savePlayerPermission(LOGIN_ID, LOGIN_ID);

        final List<UserDto> permittedUsers = playerPermissionController.getPermittedUsers();
        assertEquals(1, permittedUsers.size());
        assertEquals(LOGIN_ID, permittedUsers.get(0).getId());

        final UserEntity savedUser1 = userRepository.save(createDefaultUserEntity());
        final UserEntity savedUser2 = userRepository.save(createDefaultUserEntity());
        final UserEntity savedUser3 = userRepository.save(createDefaultUserEntity());
        savePlayerPermission(LOGIN_ID, savedUser1.getId());
        savePlayerPermission(LOGIN_ID, savedUser2.getId());
        savePlayerPermission(LOGIN_ID, savedUser3.getId());

        final List<UserDto> permittedUsersAfterSave = playerPermissionController.getPermittedUsers();
        assertEquals(4, permittedUsersAfterSave.size());
        assertEquals(LOGIN_ID, permittedUsersAfterSave.get(0).getId());
        assertEquals(savedUser1.getId(), permittedUsersAfterSave.get(1).getId());
        assertEquals(savedUser2.getId(), permittedUsersAfterSave.get(2).getId());
        assertEquals(savedUser3.getId(), permittedUsersAfterSave.get(3).getId());
    }

    @Test
    public void getPlayableUsers() {
        final UserEntity loggedInUser = createDefaultUserEntity();
        loggedInUser.setId(LOGIN_ID);
        userRepository.save(loggedInUser);
        savePlayerPermission(LOGIN_ID, LOGIN_ID);

        final List<UserDto> playableUsers = playerPermissionController.getPlayableUsers();
        assertEquals(1, playableUsers.size());
        assertEquals(LOGIN_ID, playableUsers.get(0).getId());

        final UserEntity savedUser1 = userRepository.save(createDefaultUserEntity());
        final UserEntity savedUser2 = userRepository.save(createDefaultUserEntity());
        final UserEntity savedUser3 = userRepository.save(createDefaultUserEntity());
        savePlayerPermission(savedUser1.getId(), LOGIN_ID);
        savePlayerPermission(savedUser2.getId(), LOGIN_ID);
        savePlayerPermission(savedUser3.getId(), LOGIN_ID);

        final List<UserDto> playableUsersAfterSave = playerPermissionController.getPlayableUsers();
        assertEquals(4, playableUsersAfterSave.size());
        assertEquals(LOGIN_ID, playableUsersAfterSave.get(0).getId());
        assertEquals(savedUser1.getId(), playableUsersAfterSave.get(1).getId());
        assertEquals(savedUser2.getId(), playableUsersAfterSave.get(2).getId());
        assertEquals(savedUser3.getId(), playableUsersAfterSave.get(3).getId());
    }

    private void savePlayerPermission(final String userId, final String idToPermit){
        final PlayerPermissionEntity playerPermissionEntity = new PlayerPermissionEntity();
        playerPermissionEntity.setUserId(userId);
        playerPermissionEntity.setPermittedUserId(idToPermit);
        playerPermissionRepository.save(playerPermissionEntity);
    }

    private PlayerPermissionModificationDto createModificationDtoWithId(final String permittedId){
        final PlayerPermissionModificationDto modificationDto = new PlayerPermissionModificationDto();
        modificationDto.setPermittedId(permittedId);
        return modificationDto;
    }

    private PlayerPermissionModificationDto createModificationDtoWithUserName(final String name){
        final PlayerPermissionModificationDto modificationDto = new PlayerPermissionModificationDto();
        modificationDto.setPermittedUsername(name);
        return modificationDto;
    }
}