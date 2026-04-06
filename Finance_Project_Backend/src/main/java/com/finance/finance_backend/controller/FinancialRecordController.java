package com.finance.finance_backend.controller;

import com.finance.finance_backend.dto.FinancialRecordDto;
import com.finance.finance_backend.service.FinancialRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class FinancialRecordController {

    private final FinancialRecordService service;

    @PostMapping
    public ResponseEntity<FinancialRecordDto> createRecord(@Valid @RequestBody FinancialRecordDto dto) {
        return ResponseEntity.ok(service.createRecord(dto));
    }

    @GetMapping
    public ResponseEntity<List<FinancialRecordDto>> getAllRecords() {
        return ResponseEntity.ok(service.getAllRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialRecordDto> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getRecordById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialRecordDto> updateRecord(@PathVariable Long id, @Valid @RequestBody FinancialRecordDto dto) {
        return ResponseEntity.ok(service.updateRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        service.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
