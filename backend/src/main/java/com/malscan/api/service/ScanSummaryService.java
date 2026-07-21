package com.malscan.api.service;

import com.malscan.api.dto.DashboardSummaryResponse;
import com.malscan.api.dto.FileUploadResponse;
import com.malscan.api.dto.RecentScanResponse;
import com.malscan.api.dto.ScanListItemResponse;
import com.malscan.api.exception.ApiException;
import com.malscan.api.model.ScanRecord;
import com.malscan.api.repository.ScanRecordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class ScanSummaryService {

    private final ScanRecordRepository scanRecordRepository;
    private final ScanResponseMapper scanResponseMapper;

    public ScanSummaryService(
            ScanRecordRepository scanRecordRepository,
            ScanResponseMapper scanResponseMapper
    ) {
        this.scanRecordRepository = scanRecordRepository;
        this.scanResponseMapper = scanResponseMapper;
    }

    public DashboardSummaryResponse getSummary() {
        List<ScanRecord> allRecords = scanRecordRepository.findAll();

        long maliciousScans = allRecords.stream()
                .filter(record -> "MALICIOUS".equals(record.getVerdict()))
                .count();

        long benignScans = allRecords.stream()
                .filter(record -> "BENIGN".equals(record.getVerdict()))
                .count();

        long failedScans = allRecords.stream()
                .filter(record -> "FAILED".equals(record.getStatus()))
                .count();

        double averageProbability = allRecords.stream()
                .map(ScanRecord::getProbability)
                .filter(probability -> probability != null)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0D);

        List<RecentScanResponse> recentScans = scanRecordRepository.findTop5ByOrderByUploadedAtDesc().stream()
                .sorted(Comparator.comparing(ScanRecord::getUploadedAt).reversed())
                .map(scanResponseMapper::toRecentScanResponse)
                .toList();

        return new DashboardSummaryResponse(
                allRecords.size(),
                maliciousScans,
                benignScans,
                failedScans,
                averageProbability,
                recentScans
        );
    }

    public List<ScanListItemResponse> listScans(
            String search,
            String status,
            String verdict,
            String sort
    ) {
        String normalizedSearch = normalize(search);
        String normalizedStatus = normalize(status);
        String normalizedVerdict = normalize(verdict);

        return scanRecordRepository.findAll().stream()
                .filter(record -> matchesSearch(record, normalizedSearch))
                .filter(record -> matchesExact(record.getStatus(), normalizedStatus))
                .filter(record -> matchesExact(record.getVerdict(), normalizedVerdict))
                .sorted(getSortComparator(sort))
                .map(scanResponseMapper::toScanListItemResponse)
                .toList();
    }

    public FileUploadResponse getScanDetails(String scanId) {
        ScanRecord scanRecord = scanRecordRepository.findById(scanId)
                .orElseThrow(() -> new ApiException("Scan record not found", HttpStatus.NOT_FOUND));

        return scanResponseMapper.toFileUploadResponse(scanRecord, false);
    }

    private boolean matchesSearch(ScanRecord record, String normalizedSearch) {
        if (normalizedSearch.isBlank()) {
            return true;
        }

        return normalize(record.getId()).contains(normalizedSearch)
                || normalize(record.getOriginalFilename()).contains(normalizedSearch)
                || normalize(record.getStoredFilename()).contains(normalizedSearch)
                || normalize(record.getSha256()).contains(normalizedSearch);
    }

    private boolean matchesExact(String value, String normalizedFilter) {
        if (normalizedFilter.isBlank() || "all".equals(normalizedFilter)) {
            return true;
        }

        return normalizedFilter.equals(normalize(value));
    }

    private Comparator<ScanRecord> getSortComparator(String sort) {
        Comparator<ScanRecord> byNewest = Comparator
                .comparing(ScanRecord::getUploadedAt, Comparator.nullsLast(Comparator.naturalOrder()))
                .reversed();

        String normalizedSort = normalize(sort);

        return switch (normalizedSort) {
            case "oldest" -> Comparator.comparing(
                    ScanRecord::getUploadedAt,
                    Comparator.nullsLast(Comparator.naturalOrder())
            );
            case "risk-high" -> Comparator
                    .comparing(ScanRecord::getProbability, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(byNewest);
            case "risk-low" -> Comparator
                    .comparing(ScanRecord::getProbability, Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(byNewest);
            case "name" -> Comparator
                    .comparing((ScanRecord record) -> normalize(record.getOriginalFilename()))
                    .thenComparing(byNewest);
            default -> byNewest;
        };
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }

        return value.strip().toLowerCase(Locale.ROOT);
    }
}
