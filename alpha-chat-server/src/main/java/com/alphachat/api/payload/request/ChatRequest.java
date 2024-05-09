package com.alphachat.api.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class ChatRequest {
    private Long recipientId;
}
