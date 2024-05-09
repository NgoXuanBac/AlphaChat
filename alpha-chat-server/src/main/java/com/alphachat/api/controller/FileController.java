package com.alphachat.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/file")
public class FileController {
    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestBody MultipartFile file){
        String attachmentUrl = storeAttachment(file);
        String attachmentType = file.getContentType();
        return null;
    }
    private String storeAttachment(MultipartFile file){
        return "";
    }
}
