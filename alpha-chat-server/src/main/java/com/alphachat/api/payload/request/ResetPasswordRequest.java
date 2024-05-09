package com.alphachat.api.payload.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String code;
    private String newPassword;
}
