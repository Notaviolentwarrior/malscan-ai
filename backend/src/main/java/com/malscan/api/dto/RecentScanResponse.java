package com.malscan.api.dto;

import java.time.Instant;

public record RecentScanResponse(
        String scanId,
        String originalFilename,
        String status,
        String verdict,
        Double probability,
        Instant uploadedAt
) {
}
