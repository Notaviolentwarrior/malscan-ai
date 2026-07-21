package com.malscan.api.service;

import com.malscan.api.dto.FileUploadResponse;
import com.malscan.api.exception.ApiException;
import com.malscan.api.model.ScanRecord;
import com.malscan.api.repository.ScanRecordRepository;
import com.malscan.api.util.FileValidationUtil;
import com.malscan.api.util.HashUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir;
    private final ScanRecordRepository scanRecordRepository;

    public FileStorageService(
            @Value("${app.upload-dir}") String uploadDir,
            ScanRecordRepository scanRecordRepository
    ) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
        this.scanRecordRepository = scanRecordRepository;
    }

    public FileUploadResponse storeFile(MultipartFile file) {
        try {
            Files.createDirectories(uploadDir);

            String safeOriginalFilename = FileValidationUtil.validateAndSanitize(file);
            String storedFilename = UUID.randomUUID() + "-" + safeOriginalFilename;

            Path targetPath = uploadDir.resolve(storedFilename).normalize();

            if (!targetPath.startsWith(uploadDir)) {
                throw new ApiException("Invalid file path detected", HttpStatus.BAD_REQUEST);
            }

            String sha256;
            try (InputStream hashInputStream = file.getInputStream()) {
                sha256 = HashUtil.sha256(hashInputStream);
            }

            try (InputStream fileInputStream = file.getInputStream()) {
                Files.copy(fileInputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            Instant uploadedAt = Instant.now();

            ScanRecord scanRecord = new ScanRecord(
                    safeOriginalFilename,
                    storedFilename,
                    file.getContentType(),
                    file.getSize(),
                    sha256,
                    "UPLOADED",
                    uploadedAt
            );

            ScanRecord savedRecord = scanRecordRepository.save(scanRecord);

            return new FileUploadResponse(
                    savedRecord.getId(),
                    savedRecord.getOriginalFilename(),
                    savedRecord.getStoredFilename(),
                    savedRecord.getContentType(),
                    savedRecord.getSize(),
                    savedRecord.getSha256(),
                    savedRecord.getStatus(),
                    savedRecord.getUploadedAt(),
                    "File uploaded successfully and stored in quarantine"
            );

        } catch (ApiException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ApiException("Failed to store uploaded file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
