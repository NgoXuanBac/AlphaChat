package com.alphachat.api.security;

import com.alphachat.api.constant.Constant;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

@Component @RequiredArgsConstructor
public class JwtCookie {
    public ResponseCookie generateJwtAccess(String accessToken) {
        return generateCookie(Constant.ACCESS_TOKEN, accessToken, "/api", Constant.ACCESS_TOKEN_EXP);
    }

    public ResponseCookie generateJwtRefresh(String refreshToken) {
        return generateCookie(Constant.REFRESH_TOKEN, refreshToken, "/api/auth/refresh", Constant.REFRESH_TOKEN_EXP);
    }

    public String getJwtAccess(HttpServletRequest request) {
        return getCookieValueByName(request, Constant.ACCESS_TOKEN);
    }

    public String getJwtRefresh(HttpServletRequest request) {
        return getCookieValueByName(request, Constant.REFRESH_TOKEN);
    }

    public ResponseCookie clearJwtAccess() {
        return ResponseCookie.from(Constant.ACCESS_TOKEN, "")
                .path("/api")
                .maxAge(0)
                .build();
    }

    public ResponseCookie cleanJwtRefresh() {

        return ResponseCookie.from(Constant.REFRESH_TOKEN, "")
                .path("/api/auth/refresh")
                .maxAge(0)
                .build();
    }

    private ResponseCookie generateCookie(String name, String value, String path, long expTime) {
        return ResponseCookie.from(name, value)
                .path(path)
                .maxAge(expTime)
                .httpOnly(true)
                .build();
    }

    private String getCookieValueByName(HttpServletRequest request, String name) {
        Cookie cookie = WebUtils.getCookie(request, name);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }
}
