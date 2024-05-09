package com.alphachat.api.controller;

import com.alphachat.api.payload.request.UserDetailRequest;
import com.alphachat.api.payload.response.ResponseDTO;
import com.alphachat.api.security.UserPrincipal;
import com.alphachat.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<?> getUses(){
        try{
            var users = userService.getAll();
            return ResponseEntity.ok().body(new ResponseDTO<>(true, "Get all users successfully", users));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false, "Get all users failed",ex.getMessage()));
        }
    }

    @PostMapping("/user/add")
    public ResponseEntity<?> addUser(@RequestBody UserDetailRequest request){
        try{
            userService.addUser(request);
            return ResponseEntity.ok().body(new ResponseDTO<>(true, "Add users successfully", request));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false, "Add users failed",ex.getMessage()));
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id){
        try{
            var user = userService.getDetail(id);
            return ResponseEntity.ok().body(new ResponseDTO<>(true, "Get users successfully", user));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false, "Get users failed",ex.getMessage()));
        }
    }

    @PutMapping("/user/update")
    public ResponseEntity<?> updateUser(@RequestBody UserDetailRequest request){
        try{
            userService.editUser(request);
            return ResponseEntity.ok().body(new ResponseDTO<>(true, "Add users successfully",""));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false, "Add users failed",ex.getMessage()));
        }
    }

    @DeleteMapping("/user/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        try{
            userService.delete(id);
            return ResponseEntity.ok().body(new ResponseDTO<>(true, "Delete user successfully", id));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false, "Delete user failed",ex.getMessage()));
        }
    }
}
