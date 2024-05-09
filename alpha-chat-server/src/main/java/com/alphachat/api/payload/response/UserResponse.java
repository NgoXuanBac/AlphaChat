package com.alphachat.api.payload.response;

import com.alphachat.api.enums.Status;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private Status status;
    private String avatar;
    private List<String> roles;

}
