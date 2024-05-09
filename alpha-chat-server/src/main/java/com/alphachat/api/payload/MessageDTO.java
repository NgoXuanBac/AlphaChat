package com.alphachat.api.payload;

import lombok.Builder;
import lombok.Data;

@Builder @Data
public class MessageDTO {
    private Long id;
    private UserDTO sender;
    private String content;
    private boolean isDeleted;
}
