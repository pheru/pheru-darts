package de.pheru.darts.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class FailedPasswordConfirmationException extends RuntimeException {

    public FailedPasswordConfirmationException(final String message) {
        super(message);
    }

}