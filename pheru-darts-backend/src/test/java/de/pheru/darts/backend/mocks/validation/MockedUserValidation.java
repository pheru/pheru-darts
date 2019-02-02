package de.pheru.darts.backend.mocks.validation;

import de.pheru.darts.backend.exceptions.ValidationException;
import de.pheru.darts.backend.validation.UserValidation;

public class MockedUserValidation implements UserValidation {

    public static final String VALIDATE_NAME_FAILED = "validateName failed";
    public static final String VALIDATE_PASSWORD_FAILED = "validatePassword failed";

    private boolean failOnValidateName = false;
    private boolean failOnValidatePassword = false;

    @Override
    public void validateName(final String name) throws ValidationException {
        if (failOnValidateName) {
            throw new ValidationException(VALIDATE_NAME_FAILED);
        }
    }

    @Override
    public void validatePassword(final String password) throws ValidationException {
        if (failOnValidatePassword) {
            throw new ValidationException(VALIDATE_PASSWORD_FAILED);
        }
    }

    public boolean isFailOnValidateName() {
        return failOnValidateName;
    }

    public void setFailOnValidateName(final boolean failOnValidateName) {
        this.failOnValidateName = failOnValidateName;
    }

    public boolean isFailOnValidatePassword() {
        return failOnValidatePassword;
    }

    public void setFailOnValidatePassword(final boolean failOnValidatePassword) {
        this.failOnValidatePassword = failOnValidatePassword;
    }
}