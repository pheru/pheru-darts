package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.user.SignUpDto;
import de.pheru.darts.backend.dtos.user.UserDto;
import de.pheru.darts.backend.dtos.user.UserModificationDto;
import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.mappers.EntityMapper;
import de.pheru.darts.backend.repositories.GameRepository;
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

    private final UserRepository userRepository;
    private final PlayerPermissionRepository playerPermissionRepository;
    private final GameRepository gameRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserValidation userValidation;

    public UserController(final UserRepository userRepository,
                          final PlayerPermissionRepository playerPermissionRepository,
                          final GameRepository gameRepository,
                          final BCryptPasswordEncoder bCryptPasswordEncoder,
                          final UserValidation userValidation) {
        this.userRepository = userRepository;
        this.playerPermissionRepository = playerPermissionRepository;
        this.gameRepository = gameRepository;
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

        final boolean changeName = userModificationDto.getName() != null;
        final boolean changePassword = userModificationDto.getPassword() != null;

        if (changeName) {
            userValidation.validateName(userModificationDto.getName());
            userEntity.setName(userModificationDto.getName());
        }
        if (changePassword) {
            userValidation.validatePassword(userModificationDto.getName());
            userEntity.setPassword(bCryptPasswordEncoder.encode(userModificationDto.getPassword()));
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
    public void deleteUser() {
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        playerPermissionRepository.deleteAllByUserId(loggedInUserId);
        playerPermissionRepository.deleteAllByPermittedUserId(loggedInUserId);
        gameRepository.deleteAllByUserId(loggedInUserId);
        userRepository.deleteById(loggedInUserId);
        LOGGER.info("User " + loggedInUserId + " deleted.");
    }

}