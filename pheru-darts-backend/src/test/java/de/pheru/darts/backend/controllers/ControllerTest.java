package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.entities.GameEntity;
import de.pheru.darts.backend.entities.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.UserEntity;
import de.pheru.darts.backend.mocks.repositories.MockedGameRepository;
import de.pheru.darts.backend.mocks.repositories.MockedPlayerPermissionRepository;
import de.pheru.darts.backend.mocks.repositories.MockedUserRepository;
import de.pheru.darts.backend.security.IdAuthentication;
import org.junit.Before;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;

public class ControllerTest {

    protected static final String LOGIN_ID = "login-id";
    protected static final String DEFAULT_USER_NAME = "Default-Name";
    protected static final String DEFAULT_USER_PASSWORD = "Default-Password";

    protected MockedUserRepository userRepository;
    protected MockedGameRepository gamesRepository;
    protected MockedPlayerPermissionRepository playerPermissionRepository;

    @Before
    public void controllerTestSetUp() {
        userRepository = new MockedUserRepository();
        gamesRepository = new MockedGameRepository();
        playerPermissionRepository = new MockedPlayerPermissionRepository();
        login();
    }

    private void login() {
        final IdAuthentication idAuthentication = new IdAuthentication(LOGIN_ID, new ArrayList<>());
        SecurityContextHolder.getContext().setAuthentication(idAuthentication);
    }

    protected UserEntity createDefaultUserEntity() {
        return createUserEntity(DEFAULT_USER_NAME, DEFAULT_USER_PASSWORD);
    }

    protected UserEntity createUserEntity(final String name, final String password) {
        final UserEntity user = new UserEntity();
        user.setName(name);
        user.setPassword(password);
        return user;
    }

    protected UserEntity createAndSaveDefaultLoginUser() {
        return createAndSaveLoginUser(DEFAULT_USER_NAME, DEFAULT_USER_PASSWORD);
    }

    protected UserEntity createAndSaveLoginUser(final String name, final String password) {
        final UserEntity loggedInUser = createUserEntity(name, password);
        loggedInUser.setId(LOGIN_ID);
        userRepository.save(loggedInUser);

        final PlayerPermissionEntity permissionEntity = new PlayerPermissionEntity();
        permissionEntity.setUserId(LOGIN_ID);
        permissionEntity.setPermittedUserId(LOGIN_ID);
        playerPermissionRepository.save(permissionEntity);

        final GameEntity gameEntity = new GameEntity();
        gameEntity.setUserId(LOGIN_ID);
        gamesRepository.save(gameEntity);

        return loggedInUser;
    }
}
