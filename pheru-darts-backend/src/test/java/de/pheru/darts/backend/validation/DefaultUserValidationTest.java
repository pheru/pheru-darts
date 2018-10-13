package de.pheru.darts.backend.validation;

import de.pheru.darts.backend.entities.UserEntity;
import de.pheru.darts.backend.exceptions.UsernameAlreadyExistsException;
import de.pheru.darts.backend.exceptions.ValidationException;
import de.pheru.darts.backend.mocks.repositories.MockedUserRepository;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import static org.junit.Assert.fail;

public class DefaultUserValidationTest {

    private UserValidation userValidation;
    private MockedUserRepository userRepository;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before
    public void setUp() throws Exception {
        userRepository = new MockedUserRepository();
        userValidation = new DefaultUserValidation(userRepository);
    }

    @Test
    public void validateNameOk() {
        userValidation.validateName("Guter Name");
    }

    @Test
    public void validateNameNotOkNull() {
        expectedException.expect(ValidationException.class);
        expectedException.expectMessage(DefaultUserValidation.USERNAME_EMPTY_OR_NULL);

        userValidation.validateName(null);
    }

    @Test
    public void validateNameNotOkEmpty() {
        expectedException.expect(ValidationException.class);
        expectedException.expectMessage(DefaultUserValidation.USERNAME_EMPTY_OR_NULL);

        userValidation.validateName("");
    }

    @Test
    public void validateNameNotOkNotUnique() {
        expectedException.expect(UsernameAlreadyExistsException.class);
        expectedException.expectMessage(DefaultUserValidation.USERNAME_MUST_BE_UNIQUE);

        final String name = "GibtEsSchon";

        final UserEntity userEntity = new UserEntity();
        userEntity.setName(name);
        userRepository.save(userEntity);

        userValidation.validateName(name);
    }

    @Test
    public void validatePasswordOk() {
        userValidation.validatePassword("Gutes Passwort");
    }

    @Test
    public void validatePasswordNotOkNull() {
        expectedException.expect(ValidationException.class);
        expectedException.expectMessage(DefaultUserValidation.PASSWORD_EMPTY_OR_NULL);

        userValidation.validatePassword(null);
    }

    @Test
    public void validatePasswordNotOkEmpty() {
        expectedException.expect(ValidationException.class);
        expectedException.expectMessage(DefaultUserValidation.PASSWORD_EMPTY_OR_NULL);

        userValidation.validatePassword("");
    }
}
