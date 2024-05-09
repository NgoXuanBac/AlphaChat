package com.alphachat.api.controller;

import com.alphachat.api.payload.MessageDTO;
import com.alphachat.api.payload.request.ChatRequest;
import com.alphachat.api.payload.request.MessageRequest;
import com.alphachat.api.payload.response.ResponseDTO;
import com.alphachat.api.security.UserPrincipal;
import com.alphachat.api.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage( @AuthenticationPrincipal UserPrincipal principal,
                                          @RequestBody MessageRequest request){
        try {
             var message = chatService.insertInPrivate(principal.getUserId(),request.getRecipientId(), request.getMessage().getContent());
             return ResponseEntity.ok()
                    .body(new ResponseDTO<>(true, "Send Message is successfully.",message));
        }catch (Exception ex){
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(false, "Send Message is not successfully.",ex.getMessage()));
        }
    }


    @GetMapping("/{recipientId}")
    public ResponseEntity<?> getMessages(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long recipientId
    ) {
        try {
            if(recipientId == null)
                throw new Exception("Request hasn't recipient id or room id");

            List<MessageDTO> messages = chatService.findInPrivate(principal.getUserId(), recipientId);

            return ResponseEntity.ok()
                    .body(new ResponseDTO<>(true, "Get Messages is successfully.", messages));

        }catch (Exception ex){
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(false, "Get Messages is not successfully.",ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeMessage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        try {
            var message =  chatService.removeChatMessage(id);
            return ResponseEntity.ok()
                    .body(new ResponseDTO<>(true, "Get Messages is successfully.", message));

        }catch (Exception ex){
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(false, "Get Messages is not successfully.",ex.getMessage()));
        }
    }




}
