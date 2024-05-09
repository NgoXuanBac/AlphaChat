package com.alphachat.api.payload.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String avatar;
    private String fullName;
}
