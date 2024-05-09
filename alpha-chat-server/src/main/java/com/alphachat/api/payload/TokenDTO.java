package com.alphachat.api.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class TokenDTO {
    private String code;
    private boolean verified;
}
