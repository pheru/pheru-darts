package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.entities.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.UserEntity;
import de.pheru.darts.backend.exceptions.UsernameAlreadyExistsException;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.security.SecurityConstants;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignUpController {

    private static final Logger LOGGER = new Logger();

    private final UserRepository userRepository;
    private final PlayerPermissionRepository playerPermissionRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public SignUpController(final UserRepository userRepository,
                            final PlayerPermissionRepository playerPermissionRepository,
                            final BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.playerPermissionRepository = playerPermissionRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping(SecurityConstants.SIGN_UP_URL)
    public void signUp(@RequestBody final UserEntity userEntity) {
        LOGGER.debug("POST auf " + SecurityConstants.SIGN_UP_URL + " aufgerufen");
        if (userRepository.findByName(userEntity.getName()) != null) {
            throw new UsernameAlreadyExistsException("Username must be unique");
        }
        userEntity.setPassword(bCryptPasswordEncoder.encode(userEntity.getPassword()));
        final UserEntity savedEntity = userRepository.save(userEntity);

        final PlayerPermissionEntity playerPermissionEntity = new PlayerPermissionEntity();
        playerPermissionEntity.setUserId(savedEntity.getId());
        playerPermissionEntity.setPermittedUserId(savedEntity.getId());
        playerPermissionRepository.save(playerPermissionEntity);

        LOGGER.debug("POST auf " + SecurityConstants.SIGN_UP_URL + ": erfolgreich");
    }

}
