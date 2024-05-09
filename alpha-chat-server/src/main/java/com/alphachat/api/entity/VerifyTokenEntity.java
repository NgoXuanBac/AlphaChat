package com.alphachat.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
@Data
@Entity(name = "tblVerifyTokens")
public class VerifyTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 36)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private UserEntity user;

}
