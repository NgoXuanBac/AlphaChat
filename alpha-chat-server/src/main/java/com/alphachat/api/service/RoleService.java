package com.alphachat.api.service;

import com.alphachat.api.entity.RoleEntity;
import com.alphachat.api.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }
    public RoleEntity add(String name){
        var role = new RoleEntity(name);
        return roleRepository.save(role);
    }
    public RoleEntity get(String name){
        return roleRepository.findByName(name).orElseGet(() -> add(name));
    }
}
