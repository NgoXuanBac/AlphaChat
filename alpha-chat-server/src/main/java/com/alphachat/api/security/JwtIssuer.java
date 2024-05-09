package com.alphachat.api.security;

import com.alphachat.api.constant.Constant;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtIssuer {
    private final JwtProperties properties;
    public String issue(Long userId, String email, List<String> roles){
        return JWT.create()
                .withSubject(String.valueOf(userId))
                .withExpiresAt(Instant.now().plusSeconds(Constant.ACCESS_TOKEN_EXP))
                .withClaim(Constant.EMAIL_CLAIM, email)
                .withClaim(Constant.AUTHORITY_CLAIM, roles)
                .sign(Algorithm.HMAC256(properties.getSecretKey()));
    }
}
