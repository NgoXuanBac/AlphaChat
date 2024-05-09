package com.alphachat.api.security;

import com.alphachat.api.security.JwtProperties;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class JwtDecoder {
    private final JwtProperties properties;
    public DecodedJWT decode(String token){
        try{
            return JWT.require(Algorithm.HMAC256(properties.getSecretKey()))
                    .build()
                    .verify(token);
        }catch (JWTVerificationException e) {
            return null;
        }
    }
}
