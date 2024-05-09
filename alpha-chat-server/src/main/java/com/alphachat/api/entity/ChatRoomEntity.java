package com.alphachat.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity @Getter @Setter
@Table(name = "tblChatRooms")
public class ChatRoomEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToOne
    @JoinColumn(name = "ownerId")
    private UserEntity owner;
    @OneToMany(mappedBy = "room")
    private List<MessageEntity> messages;
}
