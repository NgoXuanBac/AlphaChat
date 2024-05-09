package com.alphachat.api.service;

import com.alphachat.api.entity.MessageEntity;
import com.alphachat.api.entity.UserEntity;
import com.alphachat.api.payload.MessageDTO;
import com.alphachat.api.payload.UserDTO;
import com.alphachat.api.payload.request.ChatRequest;
import com.alphachat.api.payload.response.ChatResponse;
import com.alphachat.api.repository.ChatRoomRepository;
import com.alphachat.api.repository.MessageRepository;
import com.alphachat.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    public List<MessageDTO> findInPrivate(Long user1Id, Long user2Id) {
        var user1 = userRepository.findById(user1Id).orElseThrow();
        var user2 = userRepository.findById(user2Id).orElseThrow();

        var messages =  messageRepository.findBySenderAndRecipient(user1, user2);
        messages.addAll(messageRepository.findBySenderAndRecipient(user2, user1));
        return convertToMessageDTO(messages);
    }

    public List<MessageDTO> findInRoom(Long roomId) {
        var room = chatRoomRepository.findById(roomId).orElseThrow();
        var messages = messageRepository.findByRoom(room);
        return convertToMessageDTO(messages);
    }

    public void insertInRoom(Long senderId, Long roomId, String content){
        var sender = userRepository.findById(senderId).orElseThrow();
        var room = chatRoomRepository.findById(roomId).orElseThrow();
        var message = new MessageEntity();
        message.setSender(sender);
        message.setRoom(room);
        message.setContent(content);
        messageRepository.save(message);
    }



    public MessageEntity getLastMessage(Long user1Id, Long user2Id){
        var user1 = userRepository.findById(user1Id).orElseThrow();
        var user2 = userRepository.findById(user2Id).orElseThrow();

        var lastByUser1Send=  messageRepository.findFirstBySenderAndRecipientOrderByCreatedAtDesc(user1, user2);
        var lastByUser2Send = messageRepository.findFirstBySenderAndRecipientOrderByCreatedAtDesc(user2, user1);

        if(lastByUser2Send != null && lastByUser1Send!=null){
            boolean messageUser1Lasted = lastByUser1Send.getCreatedAt().after(lastByUser2Send.getCreatedAt());
            return messageUser1Lasted? lastByUser1Send : lastByUser2Send;
        }else if(lastByUser1Send!=null)
            return lastByUser1Send;
        else if(lastByUser2Send!=null)
            return lastByUser2Send;
        return null;
    }

    public MessageDTO insertInPrivate(Long senderId, Long recipientId, String content){
        var sender = userRepository.findById(senderId).orElseThrow();
        var recipient = userRepository.findById(recipientId).orElseThrow();
        var message = new MessageEntity();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        return convertToMessageDTO(messageRepository.save(message));

    }
    private UserDTO convertToUserDTO(UserEntity user){
        return new UserDTO(user.getId(), user.getFullName(), user.getAvatar(), user.getEmail());
    }
    private MessageDTO convertToMessageDTO(MessageEntity message){
        return MessageDTO.builder()
                .id(message.getId())
                .sender(convertToUserDTO(message.getSender()))
                .content(!message.isDeleted()?message.getContent():"The message was deleted")
                .isDeleted(message.isDeleted())
                .build();
    }
    public MessageDTO removeChatMessage(Long id){
        var message = messageRepository.findById(id).orElseThrow();
        message.setDeleted(true);
        return convertToMessageDTO(messageRepository.save(message));
    }



    private List<MessageDTO> convertToMessageDTO(List<MessageEntity> messages){
        return messages.stream()
                .sorted(Comparator.comparing(MessageEntity::getCreatedAt))
                .map(this::convertToMessageDTO
                ).toList();
    }
}
