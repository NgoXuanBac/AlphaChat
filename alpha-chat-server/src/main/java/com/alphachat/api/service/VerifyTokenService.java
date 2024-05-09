package com.alphachat.api.service;

import com.alphachat.api.constant.Constant;
import com.alphachat.api.entity.UserEntity;
import com.alphachat.api.entity.VerifyTokenEntity;
import com.alphachat.api.repository.VerifyTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerifyTokenService {
    private final VerifyTokenRepository verifyTokenRepository;
    public VerifyTokenEntity generate(UserEntity user){
        var randomCode = UUID.randomUUID().toString();
        var verifyToken = verifyTokenRepository.findByUser(user).orElseGet(VerifyTokenEntity::new);
        verifyToken.setToken(randomCode);
        verifyToken.setExpiryDate(Instant.now().plusSeconds(Constant.VERIFY_TOKEN_EXP));
        return verifyToken;
    }

    public VerifyTokenEntity findByToken(String token){
        return verifyTokenRepository.findByToken(token).orElseGet(()->null);
    }
    public void save(VerifyTokenEntity verifyToken){
        verifyTokenRepository.save(verifyToken);
    }

    @Transactional
    public void delete(String token){
       verifyTokenRepository.deleteByToken(token);
    }



}
