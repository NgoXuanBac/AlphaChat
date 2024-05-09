package com.alphachat.api.controller;

import com.alphachat.api.payload.MessageDTO;
import com.alphachat.api.payload.request.MessageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message") // /app/message
    @SendTo("/chatroom/public")
    public MessageDTO receivePublicMessage(
            @Payload MessageDTO message
    ){
        System.out.println("Co tin nhan");
        return  message;
    }

    @MessageMapping("/private-message") // app/private-message
    public MessageDTO receivePrivateMessage(
            @Payload MessageRequest request
    ){
        // /user/recipientId/private
        simpMessagingTemplate.convertAndSendToUser(
                request.getRecipientId()+"",
                "/private",
                request
        );
        // /user/recipientId/sendId/private
        simpMessagingTemplate.convertAndSendToUser(
                request.getRecipientId()+"",
                "/"+request.getMessage().getSender().getId()+"/private",
                request
        );
        return request.getMessage();
    }

    @MessageMapping("/private-message-update")
    public MessageDTO deletePrivateMessage(
            @Payload MessageRequest request
    ){
        // /user/recipientId/sendId/private-update
        simpMessagingTemplate.convertAndSendToUser(
                request.getRecipientId()+"",
                "/"+request.getMessage().getSender().getId()+"/private-update",
                request
        );
        return request.getMessage();
    }



}
