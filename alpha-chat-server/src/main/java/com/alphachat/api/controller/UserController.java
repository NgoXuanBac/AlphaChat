package com.alphachat.api.controller;

import com.alphachat.api.enums.Status;
import com.alphachat.api.payload.request.UpdateUserRequest;
import com.alphachat.api.payload.response.ResponseDTO;
import com.alphachat.api.security.UserPrincipal;
import com.alphachat.api.service.ChatService;
import com.alphachat.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    @GetMapping("/{email}")
    public ResponseEntity<?> get(@PathVariable String email){
        try {
            var user = userService.get(email);
            return ResponseEntity.ok().body(new ResponseDTO<>(
                    true,
                    "Find user successfully",
                    user
            ));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(
                    true,
                    "Not found user",
                    ""
            ));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody UpdateUserRequest request){
        try {
            var user = userService.getByEmail(principal.getEmail());
            user.setFullName(request.getFullName());
            user.setAvatar(request.getAvatar());
            if(user.getStatus()== Status.FIRST_TIME)
                user.setStatus(Status.OFFLINE);
            userService.update(user);
            return ResponseEntity.ok().body(new ResponseDTO<>(
                    true,
                    "Update user successfully",
                    user
            ));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(
                    true,
                    "Not found user",
                    ""
            ));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserPrincipal principal){
        try{
            var userProfile = userService.getProfile(principal);
            return ResponseEntity.ok().body(new ResponseDTO<>(true, "Get profile successfully", userProfile));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false, "Get profile failed",ex.getMessage()));
        }
    }
    @PostMapping("/chat/{friendId}")
    public ResponseEntity<?> makeFriends(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long friendId
    ){
        try{
            var chat = userService.makeChat(principal.getUserId(), friendId);
            return ResponseEntity.ok().body(new ResponseDTO<>(true, "Make friend successfully", chat));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false, "Make friend failed",ex.getMessage()));
        }
    }

    @GetMapping("/chats")
    public ResponseEntity<?> getChats(@AuthenticationPrincipal UserPrincipal principal){
        try {
            var chats = userService.getChats(principal.getUserId());
            return ResponseEntity.ok().body(new ResponseDTO<>(true, "Get chats successfully", chats));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false, "Get chats failed",ex.getMessage()));
        }
    }

    @DeleteMapping("/chat/{recipientId}")
    public ResponseEntity<?> removeChat(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long recipientId
    ) {
        try {
            var deleteChat = userService.removeChat(principal.getUserId(), recipientId);
            return ResponseEntity.ok()
                    .body(new ResponseDTO<>(true, "Get Messages is successfully.",deleteChat));

        }catch (Exception ex){
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(false, "Get Messages is not successfully.",ex.getMessage()));
        }
    }
}
