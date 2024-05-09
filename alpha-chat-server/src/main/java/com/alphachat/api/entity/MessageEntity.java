package com.alphachat.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Nationalized;

import java.util.Date;

@Entity @Getter @Setter
@Table(name = "tblMessages")
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String content;
    private boolean isDeleted = false;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt", nullable = false, updatable = false)
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "senderId")
    private UserEntity sender;

    @ManyToOne
    @JoinColumn(name = "recipientId")
    private UserEntity recipient;

    @ManyToOne
    @JoinColumn(name = "roomId")
    private ChatRoomEntity room;
}
