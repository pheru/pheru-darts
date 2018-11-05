package de.pheru.darts.backend.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;


public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

    private final String jwtSecret;

    public JWTAuthorizationFilter(final AuthenticationManager authManager, final String jwtSecret) {
        super(authManager);
        this.jwtSecret = jwtSecret;
    }

    @Override
    protected void doFilterInternal(final HttpServletRequest req, final HttpServletResponse res, final FilterChain chain)
            throws IOException, ServletException {
        final Cookie jwtCookie = getJwtCookie(req);
        if (jwtCookie == null) {
            chain.doFilter(req, res);
            return;
        }
        try {
            final Authentication authentication = getAuthentication(jwtCookie.getValue());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            chain.doFilter(req, res);
        } catch (final ExpiredJwtException e) {
            res.sendError(HttpStatus.UNAUTHORIZED.value(), "JWT expired!");
        }
    }

    private Authentication getAuthentication(final String token) {
        // parse the token.
        final String userId = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        if (userId != null) {
            return new IdAuthentication(userId, new ArrayList<>());
        }
        return null;
    }

    private Cookie getJwtCookie(final HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        for (final Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(SecurityConstants.JWT_COOKIE_NAME)) {
                return cookie;
            }
        }
        return null;
    }
}