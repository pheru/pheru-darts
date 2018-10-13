package de.pheru.darts.backend.validation;

import de.pheru.darts.backend.dtos.SignUpDto;
import de.pheru.darts.backend.exceptions.ValidationException;

public interface UserValidation {

    void validateName(String name) throws ValidationException;

    void validatePassword(String password) throws ValidationException;
}
