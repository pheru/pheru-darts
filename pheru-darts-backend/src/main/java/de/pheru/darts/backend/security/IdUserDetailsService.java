package de.pheru.darts.backend.security;

import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class IdUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public IdUserDetailsService(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        final UserEntity userEntity = userRepository.findByName(username);
        if (userEntity == null) {
            throw new UsernameNotFoundException("Login for username " + username + " failed: No User found.");
        }
        return new IdUser(userEntity.getId(), userEntity.getName(), userEntity.getPassword(), Collections.emptyList());
    }
}