package com.malscan.api.dto;

import java.time.Instant;

public record ErrorResponse(
        String error,
        String message,
        int status,
        String path,
        Instant timestamp
) {
}
