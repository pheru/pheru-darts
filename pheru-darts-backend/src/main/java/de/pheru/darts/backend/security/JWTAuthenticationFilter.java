package de.pheru.darts.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.pheru.darts.backend.Logger;
import de.pheru.darts.backend.exceptions.BadRequestException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private static final Logger LOGGER = new Logger(JWTAuthenticationFilter.class);

    private final AuthenticationManager authenticationManager;
    private final String jwtSecret;
    private final long jwtExpirationTime;

    public JWTAuthenticationFilter(final AuthenticationManager authenticationManager,
                                   final String jwtSecret,
                                   final long jwtExpirationTime) {
        this.authenticationManager = authenticationManager;
        this.jwtSecret = jwtSecret;
        this.jwtExpirationTime = jwtExpirationTime;
    }

    @Override
    public Authentication attemptAuthentication(final HttpServletRequest req, final HttpServletResponse res)
            throws AuthenticationException {
        try {
            final AuthenticationInput creds = new ObjectMapper().readValue(req.getInputStream(), AuthenticationInput.class);
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(creds.getName(), creds.getPassword(), new ArrayList<>())
            );
        } catch (final IOException e) {
            final String msg = "Could not read authentication information from input.";
            LOGGER.warn(msg, e);
            //TODO Filter ignoriert Status-Annotation an Exception -> 500er obwohl 400er kommen sollte
            throw new BadRequestException(msg);
        }
    }

    @Override
    protected void successfulAuthentication(final HttpServletRequest req, final HttpServletResponse res,
                                            final FilterChain chain, final Authentication auth) {
        final String token = Jwts.builder()
                .setSubject(((IdUser) auth.getPrincipal()).getId())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationTime))
                .signWith(SignatureAlgorithm.HS512, jwtSecret.getBytes())
                .compact();
        final Cookie cookie = new Cookie(SecurityConstants.JWT_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        res.addCookie(cookie);
    }

    public static class AuthenticationInput {

        private String name;
        private String password;

        public String getName() {
            return name;
        }

        public void setName(final String name) {
            this.name = name;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(final String password) {
            this.password = password;
        }
    }
}