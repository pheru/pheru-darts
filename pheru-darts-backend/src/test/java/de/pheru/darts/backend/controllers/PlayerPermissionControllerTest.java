package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.playerpermission.PlayerPermissionModificationDto;
import de.pheru.darts.backend.dtos.user.UserDto;
import de.pheru.darts.backend.entities.notification.NotificationEntity;
import de.pheru.darts.backend.entities.notification.NotificationType;
import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.exceptions.PermissionAlreadyGrantedException;
import de.pheru.darts.backend.exceptions.UserNotFoundException;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.*;

public class PlayerPermissionControllerTest extends ControllerTest {

    private static final String NAME = "name-to-permit";
    private static final String PASSWORD = "pw-to-permit";

    private PlayerPermissionController playerPermissionController;

    @Before
    public void setUp() {
        playerPermissionController = new PlayerPermissionController(playerPermissionRepository, userRepository, notificationRepository);

        createAndSaveDefaultLoginUser();
    }

    @Test
    public void postWithId() {
        final List<PlayerPermissionEntity> allBeforePost = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(1, allBeforePost.size());

        final UserEntity savedUser = userRepository.save(createUserEntity(NAME, PASSWORD));
        playerPermissionController.post(createModificationDtoWithId(savedUser.getId()));

        final List<PlayerPermissionEntity> all = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(2, all.size());

        final PlayerPermissionEntity entity = all.get(1);
        assertEquals(LOGIN_ID, entity.getUserId());
        assertEquals(savedUser.getId(), entity.getPermittedUserId());

        final List<NotificationEntity> allNotificationsAfterSave = (List<NotificationEntity>) notificationRepository.findAll();
        assertEquals(1, allNotificationsAfterSave.size());
        assertEquals(NotificationType.PLAYERPERMISSION_GRANTED, allNotificationsAfterSave.get(0).getNotificationType());
        assertEquals(savedUser.getId(), allNotificationsAfterSave.get(0).getUserId());
        assertTrue(allNotificationsAfterSave.get(0).getMessage().contains(LOGIN_NAME));
    }

    @Test
    public void postWithName() {
        final List<PlayerPermissionEntity> allBeforePost = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(1, allBeforePost.size());

        final UserEntity savedUser = userRepository.save(createUserEntity(NAME, PASSWORD));
        playerPermissionController.post(createModificationDtoWithUserName(savedUser.getName()));

        final List<PlayerPermissionEntity> all = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(2, all.size());

        final PlayerPermissionEntity entity = all.get(1);
        assertEquals(LOGIN_ID, entity.getUserId());
        assertEquals(savedUser.getId(), entity.getPermittedUserId());
    }

    @Test
    public void postWithIdUserDoesNotExist() {
        final List<PlayerPermissionEntity> allBeforePost = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(1, allBeforePost.size());
        try {
            playerPermissionController.post(createModificationDtoWithId("gibtsnicht"));
            fail("Exception expected");
        } catch (final UserNotFoundException e) {
            final List<PlayerPermissionEntity> all = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
            assertEquals(1, all.size());
        }
    }

    @Test
    public void postWithUserNameUserDoesNotExist() {
        final List<PlayerPermissionEntity> allBeforePost = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(1, allBeforePost.size());
        try {
            playerPermissionController.post(createModificationDtoWithUserName("gibtsnicht"));
            fail("Exception expected");
        } catch (final UserNotFoundException e) {
            final List<PlayerPermissionEntity> all = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
            assertEquals(1, all.size());
        }
    }

    @Test
    public void postPermissionAlreadyGranted() {
        final UserEntity savedUser = userRepository.save(createDefaultUserEntity());
        savePlayerPermission(LOGIN_ID, savedUser.getId());

        final List<PlayerPermissionEntity> allBeforePost = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(2, allBeforePost.size());
        try {
            playerPermissionController.post(createModificationDtoWithId(savedUser.getId()));
            fail("Exception expected");
        } catch (final PermissionAlreadyGrantedException e) {
            final List<PlayerPermissionEntity> all = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
            assertEquals(2, all.size());
        }
    }

    @Test
    public void deleteWithId() {
        final UserEntity savedUser = userRepository.save(createDefaultUserEntity());
        savePlayerPermission(LOGIN_ID, savedUser.getId());

        final List<PlayerPermissionEntity> allBeforePost = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(2, allBeforePost.size());

        playerPermissionController.delete(createModificationDtoWithId(savedUser.getId()));

        final List<PlayerPermissionEntity> all = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(1, all.size());

        final List<NotificationEntity> allNotificationsAfterSave = (List<NotificationEntity>) notificationRepository.findAll();
        assertEquals(1, allNotificationsAfterSave.size());
        assertEquals(NotificationType.PLAYERPERMISSION_REMOVED, allNotificationsAfterSave.get(0).getNotificationType());
        assertEquals(savedUser.getId(), allNotificationsAfterSave.get(0).getUserId());
    }

    @Test
    public void deleteWithUsername() {
        final UserEntity savedUser = userRepository.save(createDefaultUserEntity());
        savePlayerPermission(LOGIN_ID, savedUser.getId());

        final List<PlayerPermissionEntity> allBeforePost = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(2, allBeforePost.size());

        playerPermissionController.delete(createModificationDtoWithUserName(savedUser.getName()));

        final List<PlayerPermissionEntity> all = (List<PlayerPermissionEntity>) playerPermissionRepository.findAll();
        assertEquals(1, all.size());
    }

    @Test
    public void getPermittedUsers() {
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

    private void savePlayerPermission(final String userId, final String idToPermit) {
        final PlayerPermissionEntity playerPermissionEntity = new PlayerPermissionEntity();
        playerPermissionEntity.setUserId(userId);
        playerPermissionEntity.setPermittedUserId(idToPermit);
        playerPermissionRepository.save(playerPermissionEntity);
    }

    private PlayerPermissionModificationDto createModificationDtoWithId(final String permittedId) {
        final PlayerPermissionModificationDto modificationDto = new PlayerPermissionModificationDto();
        modificationDto.setPermittedId(permittedId);
        return modificationDto;
    }

    private PlayerPermissionModificationDto createModificationDtoWithUserName(final String name) {
        final PlayerPermissionModificationDto modificationDto = new PlayerPermissionModificationDto();
        modificationDto.setPermittedUsername(name);
        return modificationDto;
    }
}