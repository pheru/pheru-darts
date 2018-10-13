package de.pheru.darts.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class UsernameAlreadyExistsException extends RuntimeException {

    public UsernameAlreadyExistsException(final String message) {
        super(message);
    }

}
