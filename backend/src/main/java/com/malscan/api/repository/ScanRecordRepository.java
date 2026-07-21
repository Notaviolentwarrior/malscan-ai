package com.malscan.api.repository;

import com.malscan.api.model.ScanRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ScanRecordRepository extends MongoRepository<ScanRecord, String> {
}
