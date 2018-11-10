package de.pheru.darts.backend.validation;

import de.pheru.darts.backend.exceptions.UsernameAlreadyExistsException;
import de.pheru.darts.backend.exceptions.ValidationException;
import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.util.ReservedUser;

public class DefaultUserValidation implements UserValidation {

    public static final int USERNAME_MAX_LENGTH = 20;

    public static final String USERNAME_IS_TOO_LONG = "Username is too long (max length is " + USERNAME_MAX_LENGTH + ")";
    public static final String USERNAME_IS_NOT_ALLOWED = "Username is not allowed";
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
        if (name.length() > USERNAME_MAX_LENGTH) {
            throw new ValidationException(USERNAME_IS_TOO_LONG);
        }
        for (final ReservedUser reservedUser : ReservedUser.values()) {
            if (name.trim().equalsIgnoreCase(reservedUser.getName())) {
                throw new ValidationException(USERNAME_IS_NOT_ALLOWED);
            }
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
