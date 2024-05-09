package com.alphachat.api.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatResponse {
    private Long id;
    private String name;
    private String avatar;
    private String email;
    private String lastMessage;
}
