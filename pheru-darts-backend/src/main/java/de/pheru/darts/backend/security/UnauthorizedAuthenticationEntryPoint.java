package de.pheru.darts.backend.security;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class UnauthorizedAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(final HttpServletRequest request, final HttpServletResponse response,
                         final AuthenticationException e) throws IOException {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access denied");
    }
}
