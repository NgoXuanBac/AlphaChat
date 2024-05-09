package com.alphachat.api.repository;

import com.alphachat.api.entity.UserEntity;
import com.alphachat.api.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<UserEntity,Long> {
    public Optional<UserEntity> findByEmail(String email);
    public boolean existsByEmail(String email);
    
    public List<UserEntity> findAllByStatus(Status status);
}
