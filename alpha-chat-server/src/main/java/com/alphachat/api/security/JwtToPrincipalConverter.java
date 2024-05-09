package com.alphachat.api.security;

import com.alphachat.api.constant.Constant;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
@Component
public class JwtToPrincipalConverter {
    public UserPrincipal convert(DecodedJWT jwt){
        return UserPrincipal.builder()
                .userId(Long.valueOf(jwt.getSubject()))
                .email(jwt.getClaim(Constant.EMAIL_CLAIM).asString())
                .authorities(extractAuthoritiesFromClaim(jwt))
                .build();
    }
    private List<SimpleGrantedAuthority> extractAuthoritiesFromClaim(DecodedJWT jwt){
        var claim = jwt.getClaim(Constant.AUTHORITY_CLAIM);
        if(claim.isNull() || claim.isMissing()) return List.of();
        return claim.asList(SimpleGrantedAuthority.class);

    }
}
