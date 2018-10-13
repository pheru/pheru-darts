package de.pheru.darts.backend.security;

public class SecurityConstants {
    //TODO Secret sollte "secret" sein
    public static final String SECRET = "temp_secret";
    public static final long EXPIRATION_TIME = 2_592_000_000L; // 30 days
    public static final String JWT_COOKIE_NAME = "pd_jwt";
}