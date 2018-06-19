package de.pheru.darts.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.pheru.darts.backend.entities.UserEntity;
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

    private final AuthenticationManager authenticationManager;

    public JWTAuthenticationFilter(final AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication attemptAuthentication(final HttpServletRequest req, final HttpServletResponse res)
            throws AuthenticationException {
        try {
            final UserEntity creds = new ObjectMapper().readValue(req.getInputStream(), UserEntity.class);
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(creds.getName(), creds.getPassword(), new ArrayList<>())
            );
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(final HttpServletRequest req, final HttpServletResponse res,
                                            final FilterChain chain, final Authentication auth) {
        final String token = Jwts.builder()
                .setSubject(((IdUser) auth.getPrincipal()).getId())
                .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SecurityConstants.SECRET.getBytes())
                .compact();
        final Cookie cookie = new Cookie(SecurityConstants.JWT_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        //TODO funktioniert nicht gegen localhost, da kein https
//        cookie.setSecure(true);
        res.addCookie(cookie);
    }
}