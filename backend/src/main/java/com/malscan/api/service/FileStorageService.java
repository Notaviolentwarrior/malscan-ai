package com.malscan.api.service;

import com.malscan.api.dto.AnalyzerResponse;
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
    private final MalwareAnalyzerClient malwareAnalyzerClient;
    private final ScanResponseMapper scanResponseMapper;

    public FileStorageService(
            @Value("${app.upload-dir}") String uploadDir,
            ScanRecordRepository scanRecordRepository,
            MalwareAnalyzerClient malwareAnalyzerClient,
            ScanResponseMapper scanResponseMapper
    ) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
        this.scanRecordRepository = scanRecordRepository;
        this.malwareAnalyzerClient = malwareAnalyzerClient;
        this.scanResponseMapper = scanResponseMapper;
    }

    public FileUploadResponse storeFile(MultipartFile file, boolean forceRescan) {
        try {
            Files.createDirectories(uploadDir);

            String safeOriginalFilename = FileValidationUtil.validateAndSanitize(file);

            String sha256;
            byte[] fileBytes = file.getBytes();

            try (InputStream hashInputStream = new java.io.ByteArrayInputStream(fileBytes)) {
                sha256 = HashUtil.sha256(hashInputStream);
            }

            ScanRecord existingRecord = scanRecordRepository.findFirstBySha256OrderByUploadedAtDesc(sha256)
                    .orElse(null);

            if (existingRecord != null && !forceRescan) {
                return scanResponseMapper.toFileUploadResponse(existingRecord, true);
            }

            String storedFilename = UUID.randomUUID() + "-" + safeOriginalFilename;
            Path targetPath = uploadDir.resolve(storedFilename).normalize();

            if (!targetPath.startsWith(uploadDir)) {
                throw new ApiException("Invalid file path detected", HttpStatus.BAD_REQUEST);
            }

            try (InputStream fileInputStream = new java.io.ByteArrayInputStream(fileBytes)) {
                Files.copy(fileInputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            Instant uploadedAt = Instant.now();
            String contentType = file.getContentType() == null ? "application/octet-stream" : file.getContentType();

            ScanRecord scanRecord = new ScanRecord(
                    safeOriginalFilename,
                    storedFilename,
                    contentType,
                    file.getSize(),
                    sha256,
                    "UPLOADED",
                    uploadedAt,
                    null,
                    null,
                    null,
                    null,
                    existingRecord == null ? null : existingRecord.getId(),
                    null
            );

            ScanRecord savedRecord = scanRecordRepository.save(scanRecord);
            AnalyzerResponse analyzerResponse = runAnalysis(
                    safeOriginalFilename,
                    contentType,
                    fileBytes
            );
            applyAnalysisResult(savedRecord, analyzerResponse);

            ScanRecord updatedRecord = scanRecordRepository.save(savedRecord);
            return scanResponseMapper.toFileUploadResponse(updatedRecord, false);

        } catch (ApiException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ApiException("Failed to store uploaded file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private AnalyzerResponse runAnalysis(
            String originalFilename,
            String contentType,
            byte[] fileBytes
    ) {
        try {
            AnalyzerResponse response = malwareAnalyzerClient.analyze(
                    originalFilename,
                    contentType,
                    fileBytes
            );
            if (response == null) {
                return new AnalyzerResponse(
                        "FAILED",
                        null,
                        null,
                        null,
                        "Analyzer returned an empty response"
                );
            }
            return response;
        } catch (Exception exception) {
            return new AnalyzerResponse(
                    "FAILED",
                    null,
                    null,
                    null,
                    "Analyzer service is unavailable or returned an unexpected response"
            );
        }
    }

    private void applyAnalysisResult(ScanRecord scanRecord, AnalyzerResponse analyzerResponse) {
        scanRecord.setStatus(analyzerResponse.status());
        scanRecord.setProbability(analyzerResponse.probability());
        scanRecord.setVerdict(analyzerResponse.verdict());
        scanRecord.setModelName(analyzerResponse.modelName());
        scanRecord.setError(analyzerResponse.error());
        scanRecord.setAnalyzedAt(Instant.now());
    }
}
