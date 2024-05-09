package com.alphachat.api.payload.request;

import lombok.Data;

@Data
public class UserDetailRequest {
    private Long id;
    private String email;
    private String password;
    public String[] roles;
}
