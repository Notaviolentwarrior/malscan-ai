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
    private Instant uploadedAt;

    public ScanRecord() {
    }

    public ScanRecord(
            String originalFilename,
            String storedFilename,
            String contentType,
            long size,
            String sha256,
            String status,
            Instant uploadedAt
    ) {
        this.originalFilename = originalFilename;
        this.storedFilename = storedFilename;
        this.contentType = contentType;
        this.size = size;
        this.sha256 = sha256;
        this.status = status;
        this.uploadedAt = uploadedAt;
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

    public Instant getUploadedAt() {
        return uploadedAt;
    }
}
