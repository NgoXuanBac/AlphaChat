package com.alphachat.api.repository;

import com.alphachat.api.entity.UserEntity;
import com.alphachat.api.entity.VerifyTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerifyTokenRepository extends JpaRepository<VerifyTokenEntity, Long> {
    Optional<VerifyTokenEntity> findByToken(final String token);
    Optional<VerifyTokenEntity> findByUser(UserEntity user);
    void deleteByToken(String token);
}
