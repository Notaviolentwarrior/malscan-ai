package com.malscan.api.service;

import com.malscan.api.dto.FileUploadResponse;
import com.malscan.api.util.HashUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${app.upload-dir}") String uploadDir) {
        this.uploadDir = Path.of(uploadDir);
    }

    public FileUploadResponse storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Uploaded file is empty");
            }

            Files.createDirectories(uploadDir);

            String originalFilename = file.getOriginalFilename() == null
                    ? "unknown-file"
                    : file.getOriginalFilename();

            String storedFilename = UUID.randomUUID() + "-" + originalFilename;
            Path targetPath = uploadDir.resolve(storedFilename).normalize();

            String sha256;
            try (InputStream hashInputStream = file.getInputStream()) {
                sha256 = HashUtil.sha256(hashInputStream);
            }

            try (InputStream fileInputStream = file.getInputStream()) {
                Files.copy(fileInputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            return new FileUploadResponse(
                    originalFilename,
                    storedFilename,
                    file.getContentType(),
                    file.getSize(),
                    sha256,
                    "File uploaded successfully and stored in quarantine"
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to store uploaded file", e);
        }
    }
}
