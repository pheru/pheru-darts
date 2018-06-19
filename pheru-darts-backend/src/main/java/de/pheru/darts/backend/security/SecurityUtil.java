package de.pheru.darts.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtil {

    private SecurityUtil() {
        // Utility-Klasse
    }

    public static String getLoggedInUserId() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final IdAuthentication idAuth = (IdAuthentication) authentication;
        return idAuth.getId();
    }
}
