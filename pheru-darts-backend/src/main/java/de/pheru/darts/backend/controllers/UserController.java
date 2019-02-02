package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.user.SignUpDto;
import de.pheru.darts.backend.dtos.user.UserDeletionDto;
import de.pheru.darts.backend.dtos.user.UserDto;
import de.pheru.darts.backend.dtos.user.UserModificationDto;
import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.exceptions.FailedPasswordConfirmationException;
import de.pheru.darts.backend.mappers.EntityMapper;
import de.pheru.darts.backend.repositories.GameRepository;
import de.pheru.darts.backend.repositories.NotificationRepository;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import de.pheru.darts.backend.validation.UserValidation;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger LOGGER = new Logger();

    public static final String INVALID_CURRENT_PASSWORD = "Invalid current password";

    private final UserRepository userRepository;
    private final PlayerPermissionRepository playerPermissionRepository;
    private final GameRepository gameRepository;
    private final NotificationRepository notificationRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserValidation userValidation;

    public UserController(final UserRepository userRepository,
                          final PlayerPermissionRepository playerPermissionRepository,
                          final GameRepository gameRepository,
                          final NotificationRepository notificationRepository,
                          final BCryptPasswordEncoder bCryptPasswordEncoder,
                          final UserValidation userValidation) {
        this.userRepository = userRepository;
        this.playerPermissionRepository = playerPermissionRepository;
        this.gameRepository = gameRepository;
        this.notificationRepository = notificationRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userValidation = userValidation;
    }

    @GetMapping
    public UserDto getCurrentUser() {
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        final UserEntity userEntity = userRepository.findById(loggedInUserId);
        return EntityMapper.toUserDto(userEntity);
    }

    @PostMapping
    public void postUser(@RequestBody final SignUpDto signUpDto) {
        userValidation.validateName(signUpDto.getName());
        userValidation.validatePassword(signUpDto.getPassword());

        final UserEntity newEntity = new UserEntity();
        newEntity.setName(signUpDto.getName());
        newEntity.setPassword(bCryptPasswordEncoder.encode(signUpDto.getPassword()));
        final UserEntity savedEntity = userRepository.save(newEntity);

        final PlayerPermissionEntity playerPermissionEntity = new PlayerPermissionEntity();
        playerPermissionEntity.setUserId(savedEntity.getId());
        playerPermissionEntity.setPermittedUserId(savedEntity.getId());
        playerPermissionRepository.save(playerPermissionEntity);

        LOGGER.info("User " + savedEntity.getId() + " saved.");
    }

    @PutMapping
    public UserDto putUser(@RequestBody final UserModificationDto userModificationDto) {
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        final UserEntity userEntity = userRepository.findById(loggedInUserId);
        if (!matchesCurrentPassword(userModificationDto.getCurrentPassword(), userEntity)) {
            throw new FailedPasswordConfirmationException(INVALID_CURRENT_PASSWORD);
        }

        final boolean changeName = userModificationDto.getNewName() != null && !userModificationDto.getNewName().isEmpty();
        final boolean changePassword = userModificationDto.getNewPassword() != null && !userModificationDto.getNewPassword().isEmpty();

        if (changeName) {
            userValidation.validateName(userModificationDto.getNewName());
            userEntity.setName(userModificationDto.getNewName());
        }
        if (changePassword) {
            userValidation.validatePassword(userModificationDto.getNewPassword());
            userEntity.setPassword(bCryptPasswordEncoder.encode(userModificationDto.getNewPassword()));
        }

        final UserEntity savedEntity = userRepository.save(userEntity);

        if (changeName) {
            LOGGER.info("Name changed for user " + savedEntity.getId());
        }
        if (changePassword) {
            LOGGER.info("Password changed for user " + savedEntity.getId());
        }
        return EntityMapper.toUserDto(savedEntity);
    }

    @DeleteMapping
    public void deleteUser(@RequestBody final UserDeletionDto userDeletionDto) {
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        final UserEntity userEntity = userRepository.findById(loggedInUserId);
        if (!matchesCurrentPassword(userDeletionDto.getCurrentPassword(), userEntity)) {
            throw new FailedPasswordConfirmationException(INVALID_CURRENT_PASSWORD);
        }

        playerPermissionRepository.deleteAllByUserId(loggedInUserId);
        playerPermissionRepository.deleteAllByPermittedUserId(loggedInUserId);
        gameRepository.deleteAllByUserId(loggedInUserId);
        notificationRepository.deleteAllByUserId(loggedInUserId);
        userRepository.deleteById(loggedInUserId);
        LOGGER.info("User " + loggedInUserId + " deleted.");
    }

    private boolean matchesCurrentPassword(final String password, final UserEntity userEntity){
        return password != null && bCryptPasswordEncoder.matches(password, userEntity.getPassword());
    }
}