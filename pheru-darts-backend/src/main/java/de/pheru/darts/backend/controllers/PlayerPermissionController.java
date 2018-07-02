package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.entities.PlayerPermissionEntity;
import de.pheru.darts.backend.exceptions.ForbiddenException;
import de.pheru.darts.backend.exceptions.PermissionAlreadyGrantedException;
import de.pheru.darts.backend.mappers.EntityMapper;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.security.SecurityUtil;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/playerPermission")
public class PlayerPermissionController {

    private static final Logger LOGGER = new Logger();

    private final PlayerPermissionRepository playerPermissionRepository;

    public PlayerPermissionController(final PlayerPermissionRepository playerPermissionRepository) {
        this.playerPermissionRepository = playerPermissionRepository;
    }

    @PostMapping
    public void post(@RequestBody final PlayerPermissionEntity playerPermissionEntity) {
        LOGGER.debug("POST auf /playerPermission aufgerufen");
        if (playerPermissionEntity.getUserId() == null) {
            LOGGER.debug("No UserId provided. Using logged in UserId: " + SecurityUtil.getLoggedInUserId());
            playerPermissionEntity.setUserId(SecurityUtil.getLoggedInUserId());
        } else if (!playerPermissionEntity.getUserId().equals(SecurityUtil.getLoggedInUserId())) {
            throw new ForbiddenException("Not allowed to modify permissions from other users");
        }
        final PlayerPermissionEntity existingEntity =
                playerPermissionRepository.findByUserIdAndPermittedUserId(playerPermissionEntity.getUserId(),
                        playerPermissionEntity.getPermittedUserId());
        if (existingEntity != null) {
            throw new PermissionAlreadyGrantedException("Permission has already been granted!");
        }
        playerPermissionRepository.save(playerPermissionEntity);
        LOGGER.debug("POST auf /playerPermission: erfolgreich");
    }

    @DeleteMapping
    public void delete(@RequestBody final PlayerPermissionEntity playerPermissionEntity) {
        LOGGER.debug("DELETE auf /playerPermission mit userId= " + playerPermissionEntity.getUserId() +
                ", permittedUserId=" + playerPermissionEntity.getPermittedUserId() + " aufgerufen");
        if (playerPermissionEntity.getUserId() == null) {
            LOGGER.debug("No UserId provided. Using logged in UserId: " + SecurityUtil.getLoggedInUserId());
            playerPermissionEntity.setUserId(SecurityUtil.getLoggedInUserId());
        } else if (!playerPermissionEntity.getUserId().equals(SecurityUtil.getLoggedInUserId())) {
            throw new ForbiddenException("Not allowed to modify permissions from other users");
        }
        final PlayerPermissionEntity entityToDelete =
                playerPermissionRepository.findByUserIdAndPermittedUserId(playerPermissionEntity.getUserId(),
                        playerPermissionEntity.getPermittedUserId());
        playerPermissionRepository.delete(entityToDelete);
        LOGGER.debug("DELETE auf /playerPermission: erfolgreich");
    }

    @GetMapping("/permitted/{id}")
    public List<String> getPermittedUserIds(@PathVariable("id") final String id) {
        LOGGER.debug("GET auf /playerPermission/permitted mit id= " + id + " aufgerufen");
        if (!id.equals(SecurityUtil.getLoggedInUserId())) {
            throw new ForbiddenException("Not allowed to see permissions from other users");
        }
        final List<PlayerPermissionEntity> permittedUserIds = playerPermissionRepository.findByUserId(id);
        LOGGER.debug("GET auf /playerPermission/permitted: erfolgreich");
        return EntityMapper.toPermittedList(permittedUserIds);
    }

    @GetMapping("/playable/{id}")
    public List<String> getPlayableUserIds(@PathVariable("id") final String id) {
        LOGGER.debug("GET auf /playerPermission/playable mit id= " + id + " aufgerufen");
        if (!id.equals(SecurityUtil.getLoggedInUserId())) {
            throw new ForbiddenException("Not allowed to see playable users for other users");
        }
        final List<PlayerPermissionEntity> permittedUserIds = playerPermissionRepository.findByPermittedUserId(id);
        LOGGER.debug("GET auf /playerPermission/playable: erfolgreich");
        return EntityMapper.toPlayableList(permittedUserIds);
    }

}
