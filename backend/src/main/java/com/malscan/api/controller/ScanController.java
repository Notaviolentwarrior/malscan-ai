package com.malscan.api.controller;

import com.malscan.api.dto.DashboardSummaryResponse;
import com.malscan.api.dto.FileUploadResponse;
import com.malscan.api.dto.ScanListItemResponse;
import com.malscan.api.service.ScanSummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/scans")
public class ScanController {

    private final ScanSummaryService scanSummaryService;

    public ScanController(ScanSummaryService scanSummaryService) {
        this.scanSummaryService = scanSummaryService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(scanSummaryService.getSummary());
    }

    @GetMapping
    public ResponseEntity<List<ScanListItemResponse>> listScans(
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "verdict", required = false) String verdict,
            @RequestParam(name = "sort", required = false) String sort
    ) {
        return ResponseEntity.ok(scanSummaryService.listScans(search, status, verdict, sort));
    }

    @GetMapping("/{scanId}")
    public ResponseEntity<FileUploadResponse> getScan(@PathVariable String scanId) {
        return ResponseEntity.ok(scanSummaryService.getScanDetails(scanId));
    }
}
