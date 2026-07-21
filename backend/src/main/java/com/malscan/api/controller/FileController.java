package com.malscan.api.controller;

import com.malscan.api.dto.FileUploadResponse;
import com.malscan.api.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(name = "forceRescan", defaultValue = "false") boolean forceRescan
    ) {
        FileUploadResponse response = fileStorageService.storeFile(file, forceRescan);
        return ResponseEntity.ok(response);
    }
}
