package com.alphachat.api.payload.response;

import lombok.*;

@Data
@AllArgsConstructor
public class ResponseDTO<T> {
    private Boolean status;
    private String message;
    private T data;
}
