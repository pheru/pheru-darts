package de.pheru.darts.backend.security;

import de.pheru.darts.backend.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class DefaultLogoutHandler implements LogoutHandler {

    private static final Logger LOGGER = new Logger();

    @Override
    public void logout(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication) {
        LOGGER.debug("logout aufgerufen");
        final Cookie cookie = new Cookie(SecurityConstants.JWT_COOKIE_NAME, "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        //TODO funktioniert nicht gegen localhost, da kein https
//        cookie.setSecure(true);
        response.addCookie(cookie);
        LOGGER.debug("logout: erfolgreich");
    }
}
