package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.SignUpDto;
import de.pheru.darts.backend.dtos.UserDto;
import de.pheru.darts.backend.dtos.UserModificationDto;
import de.pheru.darts.backend.entities.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.UserEntity;
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
        LOGGER.debug("GET auf /user aufgerufen");
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        final UserEntity userEntity = userRepository.findById(loggedInUserId);
        LOGGER.debug("GET auf /user erfolgreich");
        return EntityMapper.toUserDto(userEntity);
    }

    @PostMapping
    public void postUser(@RequestBody final SignUpDto signUpDto) {
        LOGGER.debug("POST auf /user aufgerufen");

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

        LOGGER.debug("POST auf /user erfolgreich");
    }

    @PutMapping
    public UserDto putUser(@RequestBody final UserModificationDto userModificationDto) {
        LOGGER.debug("PUT auf /user aufgerufen");
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        final UserEntity userEntity = userRepository.findById(loggedInUserId);
        if (userModificationDto.getName() != null) {
            userValidation.validateName(userModificationDto.getName());
            userEntity.setName(userModificationDto.getName());
        }
        if (userModificationDto.getPassword() != null) {
            userValidation.validatePassword(userModificationDto.getName());
            userEntity.setPassword(bCryptPasswordEncoder.encode(userModificationDto.getPassword()));
        }
        final UserEntity savedEntity = userRepository.save(userEntity);
        LOGGER.debug("PUT auf /user erfolgreich");
        return EntityMapper.toUserDto(savedEntity);
    }

    @DeleteMapping
    public void deleteUser() {
        LOGGER.debug("DELETE auf /user aufgerufen");
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();
        playerPermissionRepository.deleteAllByUserId(loggedInUserId);
        playerPermissionRepository.deleteAllByPermittedUserId(loggedInUserId);
        gameRepository.deleteAllByUserId(loggedInUserId);
        userRepository.deleteById(loggedInUserId);
        LOGGER.debug("DELETE auf /user erfolgreich");
    }

}
