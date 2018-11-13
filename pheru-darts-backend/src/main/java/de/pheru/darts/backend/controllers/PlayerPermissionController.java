package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.dtos.playerpermission.PlayerPermissionModificationDto;
import de.pheru.darts.backend.dtos.user.UserDto;
import de.pheru.darts.backend.entities.notification.NotificationTemplates;
import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.exceptions.PermissionAlreadyGrantedException;
import de.pheru.darts.backend.exceptions.UserNotFoundException;
import de.pheru.darts.backend.mappers.EntityMapper;
import de.pheru.darts.backend.repositories.NotificationRepository;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/playerPermission")
public class PlayerPermissionController {

    private static final Logger LOGGER = new Logger();

    private final PlayerPermissionRepository playerPermissionRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public PlayerPermissionController(final PlayerPermissionRepository playerPermissionRepository,
                                      final UserRepository userRepository,
                                      final NotificationRepository notificationRepository) {
        this.playerPermissionRepository = playerPermissionRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    public UserDto post(@RequestBody final PlayerPermissionModificationDto modificationDto) {
        final Date timestamp = new Date();
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();

        final UserEntity userToPermit = findUserByModificationDto(modificationDto);
        final String idToPermit = userToPermit.getId();

        final PlayerPermissionEntity existingEntity =
                playerPermissionRepository.findByUserIdAndPermittedUserId(loggedInUserId, idToPermit);
        if (existingEntity != null) {
            LOGGER.warn("Permission from " + loggedInUserId + " to " + idToPermit + " has already been granted");
            throw new PermissionAlreadyGrantedException("Permission has already been granted!");
        }

        final PlayerPermissionEntity newPlayerPermission = new PlayerPermissionEntity();
        newPlayerPermission.setUserId(loggedInUserId);
        newPlayerPermission.setPermittedUserId(idToPermit);
        playerPermissionRepository.save(newPlayerPermission);
        LOGGER.info("Permission with user=" + loggedInUserId + ", permitted=" + idToPermit + " saved.");

        final UserEntity loggedInUser = userRepository.findById(loggedInUserId);
        notificationRepository.save(NotificationTemplates.permissionGranted(
                idToPermit, timestamp.getTime(), loggedInUser.getName()));
        LOGGER.info("Notification for user " + idToPermit + " saved by user " + loggedInUserId + ".");

        return EntityMapper.toUserDto(userToPermit);
    }

    private UserEntity findUserByModificationDto(final PlayerPermissionModificationDto modificationDto) {
        final String id = modificationDto.getPermittedId();
        final String username = modificationDto.getPermittedUsername();
        final UserEntity userToPermit;

        if (id != null && !id.isEmpty()) {
            userToPermit = userRepository.findById(id);
            if (userToPermit == null) {
                LOGGER.warn("User to permit not found: idToPermit=" + id);
                throw new UserNotFoundException("User not found");
            }
        } else {
            userToPermit = userRepository.findByName(username);
            if (userToPermit == null) {
                LOGGER.info("User to permit not found: username=" + username);
                throw new UserNotFoundException("User not found");
            }
        }
        return userToPermit;
    }

    @DeleteMapping
    public void delete(@RequestBody final PlayerPermissionModificationDto modificationDto) {
        final Date timestamp = new Date();
        final UserEntity userToRemovePermission = findUserByModificationDto(modificationDto);
        final String permittedId = userToRemovePermission.getId();
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();

        final PlayerPermissionEntity entityToDelete =
                playerPermissionRepository.findByUserIdAndPermittedUserId(loggedInUserId, permittedId);
        playerPermissionRepository.delete(entityToDelete);
        LOGGER.info("Permission with user=" + loggedInUserId + ", permitted=" + permittedId + " deleted.");

        final UserEntity loggedInUser = userRepository.findById(loggedInUserId);
        notificationRepository.save(NotificationTemplates.permissionRemoved(
                permittedId, timestamp.getTime(), loggedInUser.getName()));
        LOGGER.info("Notification for user " + permittedId + " saved by user " + loggedInUserId + ".");
    }

    @GetMapping("/permitted")
    public List<UserDto> getPermittedUsers() {
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();

        final List<PlayerPermissionEntity> permittedEntities = playerPermissionRepository.findByUserId(loggedInUserId);
        final List<String> permittedIds = EntityMapper.toPermittedList(permittedEntities);
        final List<UserEntity> permittedUsers = userRepository.findAll(permittedIds);

        return EntityMapper.toUserDto(permittedUsers);
    }

    @GetMapping("/playable")
    public List<UserDto> getPlayableUsers() {
        final String loggedInUserId = SecurityUtil.getLoggedInUserId();

        final List<PlayerPermissionEntity> playableEntities = playerPermissionRepository.findByPermittedUserId(loggedInUserId);
        final List<String> playableIds = EntityMapper.toPlayableList(playableEntities);
        final List<UserEntity> playableUsers = userRepository.findAll(playableIds);

        return EntityMapper.toUserDto(playableUsers);
    }

}