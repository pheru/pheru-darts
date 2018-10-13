package de.pheru.darts.backend;

import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.validation.DefaultUserValidation;
import de.pheru.darts.backend.validation.UserValidation;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class PheruDartsBackendApplication {

    private final UserRepository userRepository;

    public PheruDartsBackendApplication(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserValidation userValidation() {
        return new DefaultUserValidation(userRepository);
    }

    public static void main(final String[] args) {
        SpringApplication.run(PheruDartsBackendApplication.class, args);
    }

}
