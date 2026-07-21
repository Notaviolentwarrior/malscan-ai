package com.malscan.api.repository;

import com.malscan.api.model.ScanRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ScanRecordRepository extends MongoRepository<ScanRecord, String> {

    List<ScanRecord> findTop5ByOrderByUploadedAtDesc();

    Optional<ScanRecord> findFirstBySha256OrderByUploadedAtDesc(String sha256);
}
