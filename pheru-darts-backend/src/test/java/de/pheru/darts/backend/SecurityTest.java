package de.pheru.darts.backend;

import de.pheru.darts.backend.dtos.user.UserDto;
import de.pheru.darts.backend.repositories.GameRepository;
import de.pheru.darts.backend.repositories.NotificationRepository;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = PheruDartsBackendApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
public class SecurityTest {

    @LocalServerPort
    private int port;

    @MockBean
    private UserRepository userRepository;
    @MockBean
    private PlayerPermissionRepository playerPermissionRepository;
    @MockBean
    private GameRepository gameRepository;
    @MockBean
    private NotificationRepository notificationRepository;
    @MockBean
    private DynamoDBConfig dynamoDBConfig;
    @MockBean
    private AuthenticationManager authenticationManager;

    @Test
    public void noAuthentication() {
        final ResponseEntity<UserDto> response = new TestRestTemplate().getForEntity(
                createURLWithPort("/user"),
                UserDto.class);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    private String createURLWithPort(final String uri) {
        return "http://localhost:" + port + uri;
    }
}
