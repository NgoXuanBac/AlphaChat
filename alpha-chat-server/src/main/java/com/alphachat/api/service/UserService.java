package com.alphachat.api.service;

import com.alphachat.api.constant.Constant;
import com.alphachat.api.entity.MessageEntity;
import com.alphachat.api.entity.RoleEntity;
import com.alphachat.api.enums.Status;
import com.alphachat.api.payload.request.LoginRequest;
import com.alphachat.api.payload.request.SignupRequest;
import com.alphachat.api.entity.UserEntity;
import com.alphachat.api.payload.request.UserDetailRequest;
import com.alphachat.api.payload.response.ChatResponse;
import com.alphachat.api.payload.response.UserDetailResponse;
import com.alphachat.api.payload.response.UserResponse;
import com.alphachat.api.repository.UserRepository;
import com.alphachat.api.security.UserPrincipal;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor @Service
public class UserService {
    private final UserRepository userRepository;
    private final ChatService chatService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final VerifyTokenService verifyTokenService;
    private final  EmailService emailService;

    public UserEntity add(SignupRequest signupRequest) throws Exception {
        if(userRepository.existsByEmail(signupRequest.getEmail())){
            throw new Exception("Email is existed");
        }
        var user = new UserEntity();
        user.setEmail(signupRequest.getEmail().toLowerCase());
        user.getRoles().add(roleService.get(Constant.ROLE_USER));
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setStatus(Status.DISABLE);
        userRepository.save(user);

        sendVerificationEmail(user);
        return user;
    }

    public UserResponse authenticate(LoginRequest loginRequest) throws RuntimeException {

            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail().toLowerCase(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            var principal = (UserPrincipal) authentication.getPrincipal();
            return getProfile(principal);
    }

    public UserResponse getProfile(UserPrincipal principal){
        var roles = principal.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        var user = userRepository.findById(principal.getUserId()).orElseThrow();
        return  UserResponse.builder()
                .id(principal.getUserId())
                .fullName(user.getFullName())
                .email(principal.getEmail())
                .avatar(user.getAvatar())
                .status(user.getStatus())
                .roles(roles)
                .build();
    }

    public ChatResponse get(String email) throws Exception {
       var user =  userRepository.findByEmail(email.toLowerCase())
               .orElseThrow(()-> new UsernameNotFoundException("User not found"));
       return new ChatResponse(user.getId(), user.getFullName(), user.getAvatar(),user.getEmail(),"");
    }
    public UserEntity getByEmail(String email) throws Exception {
        return  userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));
    }

    public void connect(UserEntity user){
        user.setStatus(Status.ONLINE);
        userRepository.save(user);
    }
    public void disconnect(UserEntity user) {
        user.setStatus(Status.OFFLINE);
        userRepository.save(user);
    }

    public UserEntity verify(String token) {

        var verifyToken = verifyTokenService.findByToken(token);
        if(verifyToken == null
                || !verifyToken.getToken().equals(token)
                || verifyToken.getExpiryDate().compareTo(Instant.now()) < 0
        ){
            return null;
        }
        else{
            var user = verifyToken.getUser();
            user.setStatus(Status.FIRST_TIME);
            verifyTokenService.delete(token);
            return verifyToken.getUser();
        }
    }

    public void update(UserEntity user){
        userRepository.save(user);
    }

    public void delete(Long id){
       var user =  userRepository.findById(id).orElseThrow();
       user.setStatus(Status.DISABLE);
       userRepository.save(user);
    }
    public void updatePassword(UserEntity user, String newPassword){
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private void sendVerificationEmail(UserEntity user)
            throws MessagingException, UnsupportedEncodingException {
        var verifyToken = verifyTokenService.generate(user);
        verifyToken.setUser(user);
        verifyTokenService.save(verifyToken);
        emailService.sendConfirmRegister(user.getEmail(), verifyToken.getToken());
    }

    public Collection<ChatResponse> getChats(Long id){
        var user = userRepository.findById(id).orElseThrow();
        return user.getFriends()
                .stream()
                .filter(f -> f.getStatus() != Status.DISABLE)
                .sorted(
                        (f1, f2) -> {
                           var m1 = chatService.getLastMessage(id, f1.getId());
                           var m2 = chatService.getLastMessage(id, f2.getId());
                           return compareChat(m2, m1);
                        }
                )
                .map(f ->{
                    var lastMessage = chatService.getLastMessage(id, f.getId());
                    return new ChatResponse(
                            f.getId(),
                            f.getFullName(),
                            f.getAvatar(),
                            f.getEmail(),
                            lastMessage != null ? (lastMessage.getSender().getId().equals(id) ?"You: ":"")+lastMessage.getContent() : ""
                    );
                })
                .toList();
    }
    private int compareChat(MessageEntity message1, MessageEntity message2){
        if(message1 != null && message2 != null) return message1.getCreatedAt().compareTo(message2.getCreatedAt());
        else if (message1 != null) return 1;
        else if (message2 != null) return -1;
        else return 0;
    }

    public ChatResponse makeChat(Long user1Id, Long user2Id){
        var user1 = userRepository.findById(user1Id).orElseThrow();
        var user2 = userRepository.findById(user2Id).orElseThrow();
        if(user1.getFriends().stream().filter(u -> u.getId().equals(user2Id)).findFirst().isEmpty()){
            user1.getFriends().add(user2);
        }
        if(user2.getFriends().stream().filter(u -> u.getId().equals(user1Id)).findFirst().isEmpty()){
            user2.getFriends().add(user1);
        }
        userRepository.save(user1);
        userRepository.save(user2);

        return new ChatResponse(user2.getId(), user2.getFullName(), user2.getAvatar(),user2.getEmail(),"");
    }

    @Transactional
    public ChatResponse removeChat(Long senderId, Long recipientId){
        var sender = userRepository.findById(senderId).orElseThrow();
        var recipient = userRepository.findById(recipientId).orElseThrow();
        sender.getFriends().remove(recipient);
        userRepository.save(sender);
        return new ChatResponse(recipient.getId(), recipient.getFullName(), recipient.getAvatar(), recipient.getEmail(), "");
    }

    public List<UserDetailResponse> getAll() {
        return  userRepository.findAll().stream()
                .map(u -> UserDetailResponse.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .avatar(u.getAvatar())
                        .email(u.getEmail())
                        .status(u.getStatus())
                        .password(u.getPassword())
                        .roles(u.getRoles().stream().map(RoleEntity::getName).toList())
                        .build()
                )
                .filter(u->u.getStatus() != Status.DISABLE)
                .toList();
    }

    public void addUser(UserDetailRequest request) throws Exception {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new Exception("Email is existed");
        }
        var user = new UserEntity();
        user.setEmail(request.getEmail().toLowerCase());
        for (var role : request.roles) {
            user.getRoles().add(roleService.get(role));
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(Status.FIRST_TIME);
        userRepository.save(user);
    }

    public void editUser(UserDetailRequest request) throws Exception {
        var user = userRepository.findById(request.getId()).orElseThrow(()->new Exception("User isn't existed"));
        if(!user.getEmail().equals(request.getEmail())
                &&userRepository.existsByEmail(request.getEmail())){
            throw new Exception("Email is existed");
        }
        user.setEmail(request.getEmail().toLowerCase());
        user.getRoles().clear();
        for (var role : request.roles) {
            user.getRoles().add(roleService.get(role));
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    public UserDetailResponse getDetail(Long id) {
        var user = userRepository.findById(id).orElseThrow();
        return  UserDetailResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .avatar(user.getAvatar())
                .email(user.getEmail())
                .status(user.getStatus())
                .password(user.getPassword())
                .roles(user.getRoles().stream().map(RoleEntity::getName).toList())
                .build();
    }
}
