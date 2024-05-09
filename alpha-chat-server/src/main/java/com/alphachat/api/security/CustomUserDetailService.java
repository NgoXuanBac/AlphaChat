package com.alphachat.api.security;

import com.alphachat.api.entity.UserEntity;
import com.alphachat.api.enums.Status;
import com.alphachat.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email"));

        var authorities = user
                .getRoles()
                .stream()
                .map((role) -> new SimpleGrantedAuthority(role.getName())).toList();

        boolean enabled = user.getStatus() != Status.DISABLE;
        return UserPrincipal.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .enabled(enabled)
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }
}
