package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.mocks.repositories.MockedGameRepository;
import de.pheru.darts.backend.mocks.repositories.MockedNotificationRepository;
import de.pheru.darts.backend.mocks.repositories.MockedPlayerPermissionRepository;
import de.pheru.darts.backend.mocks.repositories.MockedUserRepository;
import de.pheru.darts.backend.security.IdAuthentication;
import org.junit.Before;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;

public class ControllerTest {

    protected static final String LOGIN_ID = "login-id";
    protected static final String LOGIN_NAME = "login-name";
    protected static final String LOGIN_PASSWORD = "login-password";

    protected BCryptPasswordEncoder passwordEncoder;

    protected MockedUserRepository userRepository;
    protected MockedGameRepository gamesRepository;
    protected MockedNotificationRepository notificationRepository;
    protected MockedPlayerPermissionRepository playerPermissionRepository;

    @Before
    public void controllerTestSetUp() {
        passwordEncoder = new BCryptPasswordEncoder();

        userRepository = new MockedUserRepository();
        gamesRepository = new MockedGameRepository();
        notificationRepository = new MockedNotificationRepository();
        playerPermissionRepository = new MockedPlayerPermissionRepository();
        login();
    }

    private void login() {
        final IdAuthentication idAuthentication = new IdAuthentication(LOGIN_ID, new ArrayList<>());
        SecurityContextHolder.getContext().setAuthentication(idAuthentication);
    }

    protected UserEntity createDefaultUserEntity() {
        return createUserEntity(LOGIN_NAME, LOGIN_PASSWORD);
    }

    protected UserEntity createUserEntity(final String name, final String password) {
        final UserEntity user = new UserEntity();
        user.setName(name);
        user.setPassword(password);
        return user;
    }

    protected UserEntity createAndSaveDefaultLoginUser() {
        return createAndSaveLoginUser(LOGIN_NAME, LOGIN_PASSWORD);
    }

    protected UserEntity createAndSaveLoginUser(final String name, final String password) {
        final UserEntity loggedInUser = createUserEntity(name, password);
        loggedInUser.setPassword(passwordEncoder.encode(loggedInUser.getPassword()));
        loggedInUser.setId(LOGIN_ID);
        userRepository.save(loggedInUser);

        final PlayerPermissionEntity permissionEntity = new PlayerPermissionEntity();
        permissionEntity.setUserId(LOGIN_ID);
        permissionEntity.setPermittedUserId(LOGIN_ID);
        playerPermissionRepository.save(permissionEntity);

        return loggedInUser;
    }
}