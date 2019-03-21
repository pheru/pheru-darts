package de.pheru.darts.backend;

import de.pheru.darts.backend.dtos.user.UserDto;
import de.pheru.darts.backend.entities.user.UserEntity;
import de.pheru.darts.backend.repositories.GameRepository;
import de.pheru.darts.backend.repositories.NotificationRepository;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import de.pheru.darts.backend.security.JWTAuthenticationFilter;
import de.pheru.darts.backend.security.SecurityConstants;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = PheruDartsBackendApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
public class SecurityTest {

    private static final String ID = "id";
    private static final String USERNAME = "username";
    private static final String PASSWORD = "password";

    @LocalServerPort
    private int port;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

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

    @Test
    public void loginThenGetUserThenLogout() {
        final TestRestTemplate restTemplate = new TestRestTemplate();
        given(userRepository.findByName(USERNAME)).willReturn(createDefaultUserEntity());
        given(userRepository.findById(ID)).willReturn(createDefaultUserEntity());

        // Login
        final JWTAuthenticationFilter.AuthenticationInput authInput = createDefaultAuthenticationInput();
        final ResponseEntity<String> responseLogin = restTemplate.postForEntity(
                createURLWithPort("/login"),
                authInput,
                String.class);
        assertEquals(HttpStatus.OK, responseLogin.getStatusCode());
        final List<String> setCookieValuesLogin = responseLogin.getHeaders().get("Set-Cookie");
        assertEquals(1, setCookieValuesLogin.size());
        assertTrue(setCookieValuesLogin.get(0).startsWith(SecurityConstants.JWT_COOKIE_NAME));
        assertTrue(setCookieValuesLogin.get(0).contains("Secure"));
        assertTrue(setCookieValuesLogin.get(0).contains("HttpOnly"));

        // Get User
        final ClientHttpRequestInterceptor cookieInterceptor = (request, body, execution) -> {
            request.getHeaders().add("Cookie", setCookieValuesLogin.get(0));
            return execution.execute(request, body);
        };
        restTemplate.getRestTemplate().getInterceptors().add(cookieInterceptor);
        final ResponseEntity<UserDto> responseGetUser = restTemplate.getForEntity(
                createURLWithPort("/user"),
                UserDto.class);
        assertEquals(HttpStatus.OK, responseGetUser.getStatusCode());
        final UserDto userDto = responseGetUser.getBody();
        assertEquals(ID, userDto.getId());
        assertEquals(USERNAME, userDto.getName());

        // Logout
        final ResponseEntity<String> responseLogout = restTemplate.getForEntity(
                createURLWithPort("/logout"),
                String.class);
        assertEquals(HttpStatus.OK, responseLogout.getStatusCode());
        final List<String> setCookieValuesLogout = responseLogout.getHeaders().get("Set-Cookie");
        assertEquals(1, setCookieValuesLogout.size());
        assertEquals(SecurityConstants.JWT_COOKIE_NAME
                + "=; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Secure; HttpOnly"
                , setCookieValuesLogout.get(0));
    }

    private String createURLWithPort(final String uri) {
        return "http://localhost:" + port + uri;
    }

    private JWTAuthenticationFilter.AuthenticationInput createDefaultAuthenticationInput() {
        final JWTAuthenticationFilter.AuthenticationInput autInput =
                new JWTAuthenticationFilter.AuthenticationInput();
        autInput.setName(USERNAME);
        autInput.setPassword(PASSWORD);
        return autInput;
    }

    private UserEntity createDefaultUserEntity() {
        final UserEntity userEntity = new UserEntity();
        userEntity.setId(ID);
        userEntity.setName(USERNAME);
        userEntity.setPassword(passwordEncoder.encode(PASSWORD));
        return userEntity;
    }
}
