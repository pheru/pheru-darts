package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.user.SignUpDto;
import de.pheru.darts.backend.dtos.user.UserDeletionDto;
import de.pheru.darts.backend.dtos.user.UserDto;
import de.pheru.darts.backend.dtos.user.UserModificationDto;
import de.pheru.darts.backend.entities.game.GameEntity;
import de.pheru.darts.backend.entities.notification.NotificationEntity;
import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.exceptions.FailedPasswordConfirmationException;
import de.pheru.darts.backend.exceptions.ValidationException;
import de.pheru.darts.backend.mocks.validation.MockedUserValidation;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import java.util.List;

import static org.junit.Assert.*;

public class UserControllerTest extends ControllerTest {

    private UserController userController;

    private MockedUserValidation userValidation;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before
    public void setUp() {
        userValidation = new MockedUserValidation();
        userController = new UserController(userRepository, playerPermissionRepository,
                gamesRepository, notificationRepository, passwordEncoder, userValidation);
    }

    @Test
    public void getCurrentUser() {
        final UserEntity loggedInUser = createAndSaveDefaultLoginUser();

        final UserDto currentUser = userController.getCurrentUser();

        assertEquals(loggedInUser.getName(), currentUser.getName());
        assertEquals(loggedInUser.getId(), currentUser.getId());
    }

    @Test
    public void signUpSuccessful() {
        final SignUpDto signUpUser = createDefaultSignUpDto();
        userController.postUser(signUpUser);

        final UserEntity savedUser = userRepository.findByName(signUpUser.getName());
        assertNotNull(savedUser.getId());
        assertFalse(savedUser.getId().isEmpty());
        assertNotEquals(signUpUser.getPassword(), savedUser.getPassword());
        assertTrue(passwordEncoder.matches(signUpUser.getPassword(), savedUser.getPassword()));

        final List<PlayerPermissionEntity> savedPermissions = playerPermissionRepository.findByUserId(savedUser.getId());
        assertEquals(1, savedPermissions.size());
        assertEquals(savedUser.getId(), savedPermissions.get(0).getUserId());
        assertEquals(savedUser.getId(), savedPermissions.get(0).getPermittedUserId());
    }

    @Test
    public void signUpFailedValidationFailedInvalidName() {
        userValidation.setFailOnValidateName(true);
        try {
            userController.postUser(createDefaultSignUpDto());
            fail("signUp should fail: validation exception expected");
        } catch (final ValidationException e) {
            assertEquals(0, userRepository.findAll().size());
        }
    }

    @Test
    public void signUpFailedValidationFailedInvalidPassword() {
        userValidation.setFailOnValidatePassword(true);
        try {
            userController.postUser(createDefaultSignUpDto());
            fail("signUp should fail: validation exception expected");
        } catch (final ValidationException e) {
            assertEquals(0, userRepository.findAll().size());
        }
    }

    @Test
    public void putUser() {
        final UserEntity loggedInUser = createAndSaveDefaultLoginUser();

        // Name
        final UserModificationDto nameModificationDto = new UserModificationDto();
        nameModificationDto.setNewName("Neuer Name");
        nameModificationDto.setCurrentPassword(LOGIN_PASSWORD);
        UserDto putUserDto = userController.putUser(nameModificationDto);

        assertEquals(nameModificationDto.getNewName(), putUserDto.getName());
        UserEntity savedUser = userRepository.findById(loggedInUser.getId());
        assertEquals(nameModificationDto.getNewName(), savedUser.getName());

        // Passwort
        final UserModificationDto pwModificationDto = new UserModificationDto();
        final String newPassword = "Neues Passwort";
        pwModificationDto.setNewPassword(newPassword);
        pwModificationDto.setCurrentPassword(LOGIN_PASSWORD);
        userController.putUser(pwModificationDto);

        savedUser = userRepository.findById(loggedInUser.getId());
        assertNotEquals(pwModificationDto.getNewPassword(), savedUser.getPassword());
        assertTrue(passwordEncoder.matches(pwModificationDto.getNewPassword(), savedUser.getPassword()));

        // Name und Passwort
        final UserModificationDto namePwModificationDto = new UserModificationDto();
        namePwModificationDto.setNewName("Ganz neuer Name");
        namePwModificationDto.setNewPassword("Ganz neues Passwort");
        namePwModificationDto.setCurrentPassword(newPassword);
        putUserDto = userController.putUser(namePwModificationDto);

        assertEquals(namePwModificationDto.getNewName(), putUserDto.getName());
        savedUser = userRepository.findById(loggedInUser.getId());
        assertEquals(namePwModificationDto.getNewName(), savedUser.getName());
        assertNotEquals(namePwModificationDto.getNewPassword(), savedUser.getPassword());
        assertTrue(passwordEncoder.matches(namePwModificationDto.getNewPassword(), savedUser.getPassword()));
    }

    @Test
    public void putUserFailedCurrentPasswordInvalid() {
        expectedException.expect(FailedPasswordConfirmationException.class);
        expectedException.expectMessage(UserController.INVALID_CURRENT_PASSWORD);

        createAndSaveDefaultLoginUser();

        final UserModificationDto nameModificationDto = new UserModificationDto();
        nameModificationDto.setNewName("Neuer Name");
        nameModificationDto.setCurrentPassword("Auf jeden Fall falsch");

        userController.putUser(nameModificationDto);
    }

    @Test
    public void putUserFailedCurrentPasswordNull() {
        expectedException.expect(FailedPasswordConfirmationException.class);
        expectedException.expectMessage(UserController.INVALID_CURRENT_PASSWORD);

        createAndSaveDefaultLoginUser();

        final UserModificationDto nameModificationDto = new UserModificationDto();
        nameModificationDto.setNewName("Neuer Name");

        userController.putUser(nameModificationDto);
    }

    @Test
    public void putUserValidateName() {
        userValidation.setFailOnValidateName(true);
        final UserEntity loggedInUser = createAndSaveDefaultLoginUser();

        // Kein Name -> Keine Validierung -> Aufruf erfolgreich
        final UserModificationDto modificationDto = new UserModificationDto();
        final String newPassword = "Was für ein tolles neues Passwort";
        modificationDto.setNewPassword(newPassword);
        modificationDto.setCurrentPassword(LOGIN_PASSWORD);
        userController.putUser(modificationDto);

        // Name -> Validierung -> Aufruf nicht erfolgreich
        modificationDto.setNewName("Toller neuer Name");
        modificationDto.setCurrentPassword(newPassword);
        try {
            userController.putUser(modificationDto);
            fail("ValidationException expected");
        } catch (final ValidationException e) {
            final UserEntity savedUser = userRepository.findById(loggedInUser.getId());
            assertEquals(loggedInUser.getName(), savedUser.getName());
            assertNotEquals(modificationDto.getNewName(), savedUser.getName());
        }
    }

    @Test
    public void putUserFailedValidatePasswordFailed() {
        userValidation.setFailOnValidatePassword(true);
        final UserEntity loggedInUser = createAndSaveDefaultLoginUser();

        // Kein Passwort -> Keine Validierung -> Aufruf erfolgreich
        final UserModificationDto modificationDto = new UserModificationDto();
        modificationDto.setNewName("Was für ein toller neuer Name");
        modificationDto.setCurrentPassword(LOGIN_PASSWORD);
        userController.putUser(modificationDto);

        // Passwort -> Validierung -> Aufruf nicht erfolgreich
        modificationDto.setNewPassword("Echt geiles Passwort");
        try {
            userController.putUser(modificationDto);
            fail("ValidationException expected");
        } catch (final ValidationException e) {
            final UserEntity savedUser = userRepository.findById(loggedInUser.getId());
            assertEquals(MockedUserValidation.VALIDATE_PASSWORD_FAILED, e.getMessage());
            assertEquals(loggedInUser.getPassword(), savedUser.getPassword());
            assertNotEquals(modificationDto.getNewPassword(), savedUser.getPassword());
        }
    }

    @Test
    public void deleteUser() {
        final UserEntity loggedInUser = createAndSaveDefaultLoginUser();

        final GameEntity gameEntity = new GameEntity();
        gameEntity.setUserId(LOGIN_ID);
        gamesRepository.save(gameEntity);

        final NotificationEntity notificationEntity = new NotificationEntity();
        notificationEntity.setUserId(LOGIN_ID);
        notificationRepository.save(notificationEntity);

        assertNotNull(userRepository.findById(loggedInUser.getId()));
        assertFalse(playerPermissionRepository.findByUserId(loggedInUser.getId()).isEmpty());
        assertFalse(playerPermissionRepository.findByPermittedUserId(loggedInUser.getId()).isEmpty());
        assertFalse(gamesRepository.findByUserId(loggedInUser.getId()).isEmpty());
        assertFalse(notificationRepository.findByUserIdOrderByTimestamp(loggedInUser.getId()).isEmpty());

        userController.deleteUser(createUserDeletionDto(LOGIN_PASSWORD));

        assertNull(userRepository.findById(loggedInUser.getId()));
        assertTrue(playerPermissionRepository.findByUserId(loggedInUser.getId()).isEmpty());
        assertTrue(playerPermissionRepository.findByPermittedUserId(loggedInUser.getId()).isEmpty());
        assertTrue(gamesRepository.findByUserId(loggedInUser.getId()).isEmpty());
        assertTrue(notificationRepository.findByUserIdOrderByTimestamp(loggedInUser.getId()).isEmpty());
    }

    @Test
    public void deletetUserFailedCurrentPasswordInvalid() {
        expectedException.expect(FailedPasswordConfirmationException.class);
        expectedException.expectMessage(UserController.INVALID_CURRENT_PASSWORD);

        createAndSaveDefaultLoginUser();

        final UserDeletionDto userDeletionDto = new UserDeletionDto();
        userDeletionDto.setCurrentPassword("Das Passwort ist wohl nicht richtig");

        userController.deleteUser(userDeletionDto);
    }

    @Test
    public void deletetUserFailedCurrentPasswordNull() {
        expectedException.expect(FailedPasswordConfirmationException.class);
        expectedException.expectMessage(UserController.INVALID_CURRENT_PASSWORD);

        createAndSaveDefaultLoginUser();

        final UserDeletionDto userDeletionDto = new UserDeletionDto();

        userController.deleteUser(userDeletionDto);
    }

    private SignUpDto createDefaultSignUpDto() {
        final SignUpDto user = new SignUpDto();
        user.setName("Name");
        user.setPassword("Password");
        return user;
    }

    private UserDeletionDto createUserDeletionDto(final String password) {
        final UserDeletionDto userDeletionDto = new UserDeletionDto();
        userDeletionDto.setCurrentPassword(password);
        return userDeletionDto;
    }

}