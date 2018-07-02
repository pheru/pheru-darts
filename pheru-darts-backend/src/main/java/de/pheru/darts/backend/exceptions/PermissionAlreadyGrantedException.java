package de.pheru.darts.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class PermissionAlreadyGrantedException extends RuntimeException {

    public PermissionAlreadyGrantedException() {
    }

    public PermissionAlreadyGrantedException(final String message) {
        super(message);
    }

    public PermissionAlreadyGrantedException(final String message, final Throwable cause) {
        super(message, cause);
    }

    public PermissionAlreadyGrantedException(final Throwable cause) {
        super(cause);
    }

    public PermissionAlreadyGrantedException(final String message, final Throwable cause, final boolean enableSuppression, final boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
