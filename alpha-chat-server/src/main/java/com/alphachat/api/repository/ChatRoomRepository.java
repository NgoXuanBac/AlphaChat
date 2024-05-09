package com.alphachat.api.repository;

import com.alphachat.api.entity.ChatRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {
}
