package com.malscan.api.dto;

import java.util.List;

public record DashboardSummaryResponse(
        long totalScans,
        long maliciousScans,
        long benignScans,
        long failedScans,
        double averageProbability,
        List<RecentScanResponse> recentScans
) {
}
