package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.UserDto;
import de.pheru.darts.backend.dtos.UserModificationDto;
import de.pheru.darts.backend.entities.UserEntity;
import de.pheru.darts.backend.exceptions.ForbiddenException;
import de.pheru.darts.backend.exceptions.UserNotFoundException;
import de.pheru.darts.backend.exceptions.UsernameAlreadyExistsException;
import de.pheru.darts.backend.mappers.EntityMapper;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger LOGGER = new Logger();

    private final UserRepository userRepository;
    private final PlayerPermissionRepository playerPermissionRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(final UserRepository userRepository,
                          final PlayerPermissionRepository playerPermissionRepository,
                          final BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.playerPermissionRepository = playerPermissionRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        LOGGER.debug("GET auf /users aufgerufen");
        final List<UserDto> userDtos = EntityMapper.toUserDto(userRepository.findAll());
        LOGGER.debug("GET auf /users: " + userDtos.size() + " UserDtos");
        return userDtos;
    }

    @GetMapping("/current")
    public UserDto getCurrentUser() {
        LOGGER.debug("GET auf /users/current aufgerufen");
        final String currentId = SecurityUtil.getLoggedInUserId();
        final UserEntity userEntity = getUserEntityById(currentId);
        LOGGER.debug("GET auf /users/current: erfolgreich");
        return EntityMapper.toUserDto(userEntity);
    }

    @GetMapping("/name/{name}")
    public UserDto getUserByName(@PathVariable("name") final String name) {
        LOGGER.debug("GET auf /users aufgerufen: name=" + name);
        final UserEntity userEntity = getUserEntityByName(name);
        LOGGER.debug("GET auf /users: UserDto mit name " + name + "  gefunden");
        return EntityMapper.toUserDto(userEntity);
    }

    @GetMapping("/id/{id}")
    public UserDto getUserById(@PathVariable("id") final String id) {
        LOGGER.debug("GET auf /users aufgerufen: id=" + id);
        final UserEntity userEntity = getUserEntityById(id);
        LOGGER.debug("GET auf /users: UserDto mit id " + id + "  gefunden");
        return EntityMapper.toUserDto(userEntity);
    }

    @PutMapping("/{id}")
    public UserDto putUser(@PathVariable("id") final String id, @RequestBody final UserModificationDto userModificationDto) {
        LOGGER.debug("PUT auf /users aufgerufen: id=" + id);
        if (!id.equals(SecurityUtil.getLoggedInUserId())) {
            throw new ForbiddenException("Not allowed to modify other users");
        }
        final UserEntity userEntity = getUserEntityById(id);
        if (userModificationDto.getName() != null && !userModificationDto.getName().isEmpty()) {
            if (userRepository.findByName(userModificationDto.getName()) != null) {
                throw new UsernameAlreadyExistsException("Username must be unique");
            }
            userEntity.setName(userModificationDto.getName());
        }
        if (userModificationDto.getPassword() != null && !userModificationDto.getPassword().isEmpty()) {
            userEntity.setPassword(bCryptPasswordEncoder.encode(userModificationDto.getPassword()));
        }
        final UserEntity savedEntity = userRepository.save(userEntity);
        LOGGER.debug("PUT auf /users aufgerufen: UserDto mit id " + id + "  erfolgreich angepasst");
        return EntityMapper.toUserDto(savedEntity);
    }

    //TODO permissions löschen
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") final String id) {
        LOGGER.debug("DELETE auf /users aufgerufen: id=" + id);
        if (!id.equals(SecurityUtil.getLoggedInUserId())) {
            throw new ForbiddenException("Not allowed to delete other users");
        }
        userRepository.deleteById(id);
        LOGGER.debug("DELETE auf /users aufgerufen: UserDto mit id " + id + " erfolgreich gelöscht");
    }

    private UserEntity getUserEntityByName(final String name) {
        final UserEntity userEntity = userRepository.findByName(name);
        if (userEntity != null) {
            return userEntity;
        }
        throw new UserNotFoundException("No User with name '" + name + "' found");
    }

    private UserEntity getUserEntityById(final String id) {
        final UserEntity userEntity = userRepository.findById(id);
        if (userEntity != null) {
            return userEntity;
        }
        throw new UserNotFoundException("No User with id '" + id + "' found");
    }

}
