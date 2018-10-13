package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.SignUpDto;
import de.pheru.darts.backend.dtos.UserDto;
import de.pheru.darts.backend.dtos.UserModificationDto;
import de.pheru.darts.backend.entities.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.UserEntity;
import de.pheru.darts.backend.exceptions.ValidationException;
import de.pheru.darts.backend.mocks.validation.MockedUserValidation;
import org.junit.Before;
import org.junit.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

import static org.junit.Assert.*;

public class UserControllerTest extends ControllerTest {

    private UserController userController;
    private BCryptPasswordEncoder passwordEncoder;
    private MockedUserValidation userValidation;

    @Before
    public void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        userValidation = new MockedUserValidation();
        userController = new UserController(userRepository, playerPermissionRepository, gamesRepository, passwordEncoder, userValidation);
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
        nameModificationDto.setName("Neuer Name");
        UserDto putUserDto = userController.putUser(nameModificationDto);

        assertEquals(nameModificationDto.getName(), putUserDto.getName());
        UserEntity savedUser = userRepository.findById(loggedInUser.getId());
        assertEquals(nameModificationDto.getName(), savedUser.getName());

        // Passwort
        final UserModificationDto pwModificationDto = new UserModificationDto();
        pwModificationDto.setPassword("Neues Passwort");
        userController.putUser(pwModificationDto);

        savedUser = userRepository.findById(loggedInUser.getId());
        assertNotEquals(pwModificationDto.getPassword(), savedUser.getPassword());
        assertTrue(passwordEncoder.matches(pwModificationDto.getPassword(), savedUser.getPassword()));

        // Name und Passwort
        final UserModificationDto namePwModificationDto = new UserModificationDto();
        namePwModificationDto.setName("Ganz neuer Name");
        namePwModificationDto.setPassword("Ganz neues Passwort");
        putUserDto = userController.putUser(namePwModificationDto);

        assertEquals(namePwModificationDto.getName(), putUserDto.getName());
        savedUser = userRepository.findById(loggedInUser.getId());
        assertEquals(namePwModificationDto.getName(), savedUser.getName());
        assertNotEquals(namePwModificationDto.getPassword(), savedUser.getPassword());
        assertTrue(passwordEncoder.matches(namePwModificationDto.getPassword(), savedUser.getPassword()));
    }

    @Test
    public void putUserValidateName() {
        userValidation.setFailOnValidateName(true);
        final UserEntity loggedInUser = createAndSaveDefaultLoginUser();

        // Kein Name -> Keine Validierung -> Aufruf erfolgreich
        final UserModificationDto modificationDto = new UserModificationDto();
        modificationDto.setPassword("Was für ein tolles neues Passwort");
        userController.putUser(modificationDto);

        // Name -> Validierung -> Aufruf nicht erfolgreich
        modificationDto.setName("Toller neuer Name");
        try {
            userController.putUser(modificationDto);
            fail("ValidationException expected");
        } catch (final ValidationException e) {
            final UserEntity savedUser = userRepository.findById(loggedInUser.getId());
            assertEquals(loggedInUser.getName(), savedUser.getName());
            assertNotEquals(modificationDto.getName(), savedUser.getName());
        }
    }

    @Test
    public void putUserFailedValidatePasswordFailed() {
        userValidation.setFailOnValidatePassword(true);
        final UserEntity loggedInUser = createAndSaveDefaultLoginUser();

        // Kein Passwort -> Keine Validierung -> Aufruf erfolgreich
        final UserModificationDto modificationDto = new UserModificationDto();
        modificationDto.setName("Was für ein toller neuer Name");
        userController.putUser(modificationDto);

        // Passwort -> Validierung -> Aufruf nicht erfolgreich
        modificationDto.setPassword("Echt geiles Passwort");
        try {
            userController.putUser(modificationDto);
            fail("ValidationException expected");
        } catch (final ValidationException e) {
            final UserEntity savedUser = userRepository.findById(loggedInUser.getId());
            assertEquals(loggedInUser.getPassword(), savedUser.getPassword());
            assertNotEquals(modificationDto.getPassword(), savedUser.getPassword());
        }
    }

    @Test
    public void deleteUser() {
        final UserEntity loggedInUser = createAndSaveDefaultLoginUser();

        assertNotNull(userRepository.findById(loggedInUser.getId()));
        assertNotNull(playerPermissionRepository.findByUserId(loggedInUser.getId()));
        assertNotNull(playerPermissionRepository.findByPermittedUserId(loggedInUser.getId()));
        assertNotNull(gamesRepository.findByUserId(loggedInUser.getId()));

        userController.deleteUser();

        assertNull(userRepository.findById(loggedInUser.getId()));
        assertTrue(playerPermissionRepository.findByUserId(loggedInUser.getId()).isEmpty());
        assertTrue(playerPermissionRepository.findByPermittedUserId(loggedInUser.getId()).isEmpty());
        assertTrue(gamesRepository.findByUserId(loggedInUser.getId()).isEmpty());
    }

    private SignUpDto createDefaultSignUpDto() {
        final SignUpDto user = new SignUpDto();
        user.setName("Name");
        user.setPassword("Password");
        return user;
    }

}