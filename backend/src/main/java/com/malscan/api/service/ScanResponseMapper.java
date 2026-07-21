package com.malscan.api.service;

import com.malscan.api.dto.FileUploadResponse;
import com.malscan.api.dto.RecentScanResponse;
import com.malscan.api.dto.ScanListItemResponse;
import com.malscan.api.model.ScanRecord;
import org.springframework.stereotype.Component;

@Component
public class ScanResponseMapper {

    public FileUploadResponse toFileUploadResponse(ScanRecord scanRecord, boolean reusedExistingResult) {
        return new FileUploadResponse(
                scanRecord.getId(),
                scanRecord.getOriginalFilename(),
                scanRecord.getStoredFilename(),
                scanRecord.getContentType(),
                scanRecord.getSize(),
                scanRecord.getSha256(),
                scanRecord.getStatus(),
                scanRecord.getProbability(),
                scanRecord.getVerdict(),
                scanRecord.getModelName(),
                scanRecord.getError(),
                reusedExistingResult,
                scanRecord.getDuplicateOfScanId(),
                scanRecord.getUploadedAt(),
                scanRecord.getAnalyzedAt(),
                buildMessage(scanRecord, reusedExistingResult)
        );
    }

    public RecentScanResponse toRecentScanResponse(ScanRecord scanRecord) {
        return new RecentScanResponse(
                scanRecord.getId(),
                scanRecord.getOriginalFilename(),
                scanRecord.getStatus(),
                scanRecord.getVerdict(),
                scanRecord.getProbability(),
                scanRecord.getUploadedAt()
        );
    }

    public ScanListItemResponse toScanListItemResponse(ScanRecord scanRecord) {
        return new ScanListItemResponse(
                scanRecord.getId(),
                scanRecord.getOriginalFilename(),
                scanRecord.getSha256(),
                scanRecord.getStatus(),
                scanRecord.getVerdict(),
                scanRecord.getProbability(),
                scanRecord.getModelName(),
                scanRecord.getError(),
                scanRecord.getDuplicateOfScanId(),
                scanRecord.getUploadedAt(),
                scanRecord.getAnalyzedAt()
        );
    }

    private String buildMessage(ScanRecord scanRecord, boolean reusedExistingResult) {
        if (reusedExistingResult) {
            return "Identical SHA-256 already exists. Reusing the saved scan result";
        }

        if ("COMPLETED".equals(scanRecord.getStatus())) {
            if (scanRecord.getDuplicateOfScanId() != null) {
                return "Duplicate file hash detected and re-analyzed successfully";
            }

            return "File uploaded to quarantine and analyzed successfully";
        }

        if (scanRecord.getDuplicateOfScanId() != null) {
            return "Duplicate file hash detected, but the re-analysis did not complete successfully";
        }

        return "File uploaded to quarantine, but analysis did not complete successfully";
    }
}
