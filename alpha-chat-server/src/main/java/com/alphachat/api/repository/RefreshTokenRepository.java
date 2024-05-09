package com.alphachat.api.repository;

import com.alphachat.api.entity.RefreshTokenEntity;
import com.alphachat.api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshTokenEntity, Long> {
    Optional<RefreshTokenEntity> findByToken(String token);
    Optional<RefreshTokenEntity> findByUser(UserEntity user);
    @Modifying
    void deleteByUser(UserEntity user);
}
