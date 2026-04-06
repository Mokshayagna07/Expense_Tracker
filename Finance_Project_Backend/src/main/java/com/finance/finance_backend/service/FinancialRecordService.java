package com.finance.finance_backend.service;

import com.finance.finance_backend.dto.FinancialRecordDto;
import com.finance.finance_backend.entity.FinancialRecord;
import com.finance.finance_backend.entity.User;
import com.finance.finance_backend.repository.FinancialRecordRepository;
import com.finance.finance_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinancialRecordService {

    private final FinancialRecordRepository repository;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).map(User::getId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public FinancialRecordDto createRecord(FinancialRecordDto dto) {
        FinancialRecord record = FinancialRecord.builder()
                .amount(dto.getAmount())
                .category(dto.getCategory())
                .date(dto.getDate())
                .notes(dto.getNotes())
                .type(dto.getType())
                .userId(getCurrentUserId())
                .build();
        
        record = repository.save(record);
        dto.setId(record.getId());
        return dto;
    }

    public List<FinancialRecordDto> getAllRecords() {
        return repository.findByUserId(getCurrentUserId()).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public FinancialRecordDto getRecordById(Long id) {
        FinancialRecord record = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        if (!record.getUserId().equals(getCurrentUserId())) throw new RuntimeException("Unauthorized");
        return mapToDto(record);
    }

    public FinancialRecordDto updateRecord(Long id, FinancialRecordDto dto) {
        FinancialRecord record = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        if (!record.getUserId().equals(getCurrentUserId())) throw new RuntimeException("Unauthorized");
        
        record.setAmount(dto.getAmount());
        record.setCategory(dto.getCategory());
        record.setDate(dto.getDate());
        record.setNotes(dto.getNotes());
        record.setType(dto.getType());
        
        repository.save(record);
        dto.setId(id);
        return dto;
    }

    public void deleteRecord(Long id) {
        FinancialRecord record = repository.findById(id).orElseThrow(() -> new RuntimeException("Record not found"));
        if (!record.getUserId().equals(getCurrentUserId())) throw new RuntimeException("Unauthorized");
        repository.deleteById(id);
    }

    private FinancialRecordDto mapToDto(FinancialRecord record) {
        return FinancialRecordDto.builder()
                .id(record.getId())
                .amount(record.getAmount())
                .category(record.getCategory())
                .date(record.getDate())
                .type(record.getType())
                .notes(record.getNotes())
                .build();
    }
}
