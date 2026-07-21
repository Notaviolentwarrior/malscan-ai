package com.malscan.api.dto;

import java.time.Instant;

public record FileUploadResponse(
        String scanId,
        String originalFilename,
        String storedFilename,
        String contentType,
        long size,
        String sha256,
        String status,
        Instant uploadedAt,
        String message
) {
}
