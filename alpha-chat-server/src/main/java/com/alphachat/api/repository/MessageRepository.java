package com.alphachat.api.repository;

import com.alphachat.api.entity.ChatRoomEntity;
import com.alphachat.api.entity.MessageEntity;
import com.alphachat.api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    List<MessageEntity> findBySenderAndRecipient(UserEntity sender, UserEntity recipient);
    MessageEntity findFirstBySenderAndRecipientOrderByCreatedAtDesc(UserEntity sender, UserEntity recipient);
    List<MessageEntity> findByRoom(ChatRoomEntity room);
    void deleteAllBySenderAndRecipient(UserEntity sender, UserEntity recipient);
}
