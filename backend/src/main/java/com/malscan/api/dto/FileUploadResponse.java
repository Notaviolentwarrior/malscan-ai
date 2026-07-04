package com.malscan.api.dto;

public record FileUploadResponse(
        String originalFilename,
        String storedFilename,
        String contentType,
        long size,
        String sha256,
        String message
) {
}
