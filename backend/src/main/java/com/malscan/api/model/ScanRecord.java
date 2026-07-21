package com.malscan.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "scan_records")
public class ScanRecord {

    @Id
    private String id;

    private String originalFilename;
    private String storedFilename;
    private String contentType;
    private long size;
    private String sha256;
    private String status;
    private Double probability;
    private String verdict;
    private String modelName;
    private String error;
    private String duplicateOfScanId;
    private Instant uploadedAt;
    private Instant analyzedAt;

    public ScanRecord() {
    }

    public ScanRecord(
            String originalFilename,
            String storedFilename,
            String contentType,
            long size,
            String sha256,
            String status,
            Instant uploadedAt,
            Double probability,
            String verdict,
            String modelName,
            String error,
            String duplicateOfScanId,
            Instant analyzedAt
    ) {
        this.originalFilename = originalFilename;
        this.storedFilename = storedFilename;
        this.contentType = contentType;
        this.size = size;
        this.sha256 = sha256;
        this.status = status;
        this.uploadedAt = uploadedAt;
        this.probability = probability;
        this.verdict = verdict;
        this.modelName = modelName;
        this.error = error;
        this.duplicateOfScanId = duplicateOfScanId;
        this.analyzedAt = analyzedAt;
    }

    public String getId() {
        return id;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getStoredFilename() {
        return storedFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSize() {
        return size;
    }

    public String getSha256() {
        return sha256;
    }

    public String getStatus() {
        return status;
    }

    public Double getProbability() {
        return probability;
    }

    public String getVerdict() {
        return verdict;
    }

    public String getModelName() {
        return modelName;
    }

    public String getError() {
        return error;
    }

    public String getDuplicateOfScanId() {
        return duplicateOfScanId;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public Instant getAnalyzedAt() {
        return analyzedAt;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setProbability(Double probability) {
        this.probability = probability;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public void setError(String error) {
        this.error = error;
    }

    public void setDuplicateOfScanId(String duplicateOfScanId) {
        this.duplicateOfScanId = duplicateOfScanId;
    }

    public void setAnalyzedAt(Instant analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
}
