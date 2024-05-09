package com.alphachat.api.payload.request;

import lombok.*;

@Data
@AllArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
