package com.alphachat.api.constant;

public class Constant {
    private Constant(){}
    public static final String ACCESS_TOKEN = "AccessToken";
    public static final long ACCESS_TOKEN_EXP = 90;
    public static final String REFRESH_TOKEN = "RefreshToken";
    public static final long REFRESH_TOKEN_EXP = 604800;
    public static final long VERIFY_TOKEN_EXP =  28800;

    public static final String ALLOWED_ORIGIN = "http://localhost:3000";
    public static final String ROLE_USER = "USER";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String EMAIL_CLAIM = "e";
    public static final String AUTHORITY_CLAIM = "a";

    public static final String API_URL = "/api/**";
    public static final String[] UNSECURED_URLS = {"/api/auth/**"};
    public static final String ADMIN_SECURITY_URL = "/api/admin/users";

}
