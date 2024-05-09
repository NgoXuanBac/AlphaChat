package com.alphachat.api.service;

import com.alphachat.api.constant.Constant;
import com.alphachat.api.entity.RefreshTokenEntity;
import com.alphachat.api.repository.RefreshTokenRepository;
import com.alphachat.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public Optional<RefreshTokenEntity> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }
    public RefreshTokenEntity create(Long userId) throws Exception {
        var user =  userRepository.findById(userId);
        if(user.isEmpty()) throw new Exception("User id isn't existed");

        var token = refreshTokenRepository.findByUser(user.get()).orElseGet(RefreshTokenEntity::new);
        token.setUser(user.get());
        token.setExpiryDate(Instant.now().plusSeconds(Constant.REFRESH_TOKEN_EXP));
        token.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(token);
    }


    public RefreshTokenEntity verifyExpiration(RefreshTokenEntity token){
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            return null;
        }
        return token;
    }

    @Transactional
    public void deleteByUserId(Long userId)  {
        var user = userRepository.findById(userId);
        if(user.isEmpty()) return;
        refreshTokenRepository.deleteByUser(user.get());
    }
}
