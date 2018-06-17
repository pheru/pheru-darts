package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.UserDto;
import de.pheru.darts.backend.entities.UserEntity;
import de.pheru.darts.backend.exceptions.UserNotFoundException;
import de.pheru.darts.backend.mappers.EntityToDtoMapper;
import de.pheru.darts.backend.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private static final Logger LOGGER = new Logger();

    private final UserRepository userRepository;

    public UserController(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
        LOGGER.debug("GET auf /users aufgerufen");
        final List<UserDto> userDtos = EntityToDtoMapper.toUserDto(userRepository.findAll());
        LOGGER.debug("GET auf /users: " + userDtos.size() + " UserDtos");
        return userDtos;
    }

    @GetMapping("/users/name/{name}")
    public UserDto getUserByName(@PathVariable("name") final String name) {
        LOGGER.debug("GET auf /users aufgerufen: name=" + name);
        final UserEntity userEntity = getUserEntityByName(name);
        LOGGER.debug("GET auf /users: UserDto mit name " + name + "  gefunden");
        return EntityToDtoMapper.toUserDto(userEntity);
    }

    @GetMapping("/users/id/{id}")
    public UserDto getUserById(@PathVariable("id") final String id) {
        LOGGER.debug("GET auf /users aufgerufen: id=" + id);
        final UserEntity userEntity = getUserEntityById(id);
        LOGGER.debug("GET auf /users: UserDto mit id " + id + "  gefunden");
        return EntityToDtoMapper.toUserDto(userEntity);
    }

    @PutMapping("/users")
    public UserDto putUser(@RequestBody final UserDto userDto) {
        LOGGER.debug("PUT auf /users aufgerufen: id=" + userDto.getId());
        // erst mit Rechteprüfung
        throw new UnsupportedOperationException();
//        final UserEntity userEntity = getUserEntityById(userDto.getId());
//        userEntity.setName(userDto.getName());
//        userRepository.save(userEntity);
//        LOGGER.debug("PUT auf /users aufgerufen: UserDto mit id " + userDto.getId() + "  erfolgreich angepasst");
//        return userDto;
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable("id") final String id) {
        LOGGER.debug("DELETE auf /users aufgerufen: id=" + id);
        // erst mit Rechteprüfung
        throw new UnsupportedOperationException();
//        userRepository.deleteById(id);
//        LOGGER.debug("DELETE auf /users aufgerufen: UserDto mit id " + id + " erfolgreich gelöscht");
    }

    private UserEntity getUserEntityByName(final String name) {
        final UserEntity userEntity = userRepository.findByName(name);
        if (userEntity != null) {
            return userEntity;
        }
        throw new UserNotFoundException();
    }

    private UserEntity getUserEntityById(final String id) {
        final UserEntity userEntity = userRepository.findById(id);
        if (userEntity != null) {
            return userEntity;
        }
        throw new UserNotFoundException();
    }

}
