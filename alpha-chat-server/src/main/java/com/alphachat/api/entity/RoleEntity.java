package com.alphachat.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity @Table(name = "tblRoles")
public class RoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    public RoleEntity(){}
    public RoleEntity(String name){
        this.name = name;
    }

}
