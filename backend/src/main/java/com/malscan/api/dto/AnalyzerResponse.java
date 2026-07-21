package com.malscan.api.dto;

public record AnalyzerResponse(
        String status,
        String modelName,
        Double probability,
        String verdict,
        String error
) {
}
