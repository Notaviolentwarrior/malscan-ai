package com.malscan.api.dto;

import java.time.Instant;

public record ScanListItemResponse(
        String scanId,
        String originalFilename,
        String sha256,
        String status,
        String verdict,
        Double probability,
        String modelName,
        String error,
        String duplicateOfScanId,
        Instant uploadedAt,
        Instant analyzedAt
) {
}
