package de.pheru.darts.backend.validation;

import de.pheru.darts.backend.exceptions.UsernameAlreadyExistsException;
import de.pheru.darts.backend.exceptions.ValidationException;
import de.pheru.darts.backend.repositories.UserRepository;

public class DefaultUserValidation implements UserValidation {

    public static final String USERNAME_MUST_BE_UNIQUE = "Username must be unique";
    public static final String USERNAME_EMPTY_OR_NULL = "Username must be set";
    public static final String PASSWORD_EMPTY_OR_NULL = "Password must be set";

    private final UserRepository userRepository;

    public DefaultUserValidation(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void validateName(final String name) throws ValidationException {
        if (name == null || name.trim().isEmpty()) {
            throw new ValidationException(USERNAME_EMPTY_OR_NULL);
        }
        if (userRepository.findByName(name) != null) {
            throw new UsernameAlreadyExistsException(USERNAME_MUST_BE_UNIQUE);
        }
    }

    @Override
    public void validatePassword(final String password) throws ValidationException {
        if (password == null || password.trim().isEmpty()) {
            throw new ValidationException(PASSWORD_EMPTY_OR_NULL);
        }
    }
}
