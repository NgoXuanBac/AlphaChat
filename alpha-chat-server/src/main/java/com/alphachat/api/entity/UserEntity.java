package com.alphachat.api.entity;

import com.alphachat.api.enums.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity @Table(name="tblUsers")
public class UserEntity {
    @Id
    @GeneratedValue
    private Long id;
    @Column(unique = true)
    private String email;

    private String fullName="NO_NAME";
    private String avatar="";

    @JsonIgnore
    private String password;

    @JsonIgnore
    private Status status = Status.DISABLE;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name="tblUserRoles",
            joinColumns = @JoinColumn(name="userId", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "roleId", referencedColumnName = "id")
    )
    private Collection<RoleEntity> roles = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "tblUserFriends",
            joinColumns = @JoinColumn(name="userId"),
            inverseJoinColumns = @JoinColumn(name = "friendId")
    )
    private Collection<UserEntity> friends = new ArrayList<>();

    public UserEntity(){}
}
