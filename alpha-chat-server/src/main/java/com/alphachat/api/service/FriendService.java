package com.alphachat.api.service;

import com.alphachat.api.entity.UserEntity;
import com.alphachat.api.enums.Status;
import com.alphachat.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final UserRepository userRepository;

    public void addFriend(Long userId, Long friendId){
        var friend = userRepository.findById(friendId).orElseThrow();
        var user = userRepository.findById(userId).orElseThrow();
        user.getFriends().add(friend);
        userRepository.save(user);
    }
    public void deleteFriend(Long userId, Long friendId){
        var friend = userRepository.findById(friendId).orElseThrow();
        var user = userRepository.findById(userId).orElseThrow();
        user.getFriends().remove(friend);
        userRepository.save(user);
    }
    public List<UserEntity> findFriend(Long userId){
        var user = userRepository.findById(userId).orElseThrow();
        return user.getFriends().stream().toList();
    }
}
