package com.alphachat.api.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity(name = "tblRefreshTokens")
public class RefreshTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private UserEntity user;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;
}
