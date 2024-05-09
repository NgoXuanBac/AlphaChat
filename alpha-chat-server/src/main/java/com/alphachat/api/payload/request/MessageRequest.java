package com.alphachat.api.payload.request;

import com.alphachat.api.payload.MessageDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageRequest {
    private Long recipientId;
    private MessageDTO message;
}
