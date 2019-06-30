package de.pheru.darts.backend.testutil;

import de.pheru.darts.backend.security.IdAuthentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;

public final class SecurityTestUtil {

    private SecurityTestUtil() {
        // Utility-Klasse
    }

    public static void setIdAuthenticationInSecurityContext(final String id) {
        final IdAuthentication idAuthentication = new IdAuthentication(id, new ArrayList<>());
        SecurityContextHolder.getContext().setAuthentication(idAuthentication);
    }
}