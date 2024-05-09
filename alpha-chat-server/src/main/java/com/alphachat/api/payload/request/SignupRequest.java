package com.alphachat.api.payload.request;

import lombok.*;

@Data
@AllArgsConstructor
public class SignupRequest {
    private String email;
    private String password;
}
