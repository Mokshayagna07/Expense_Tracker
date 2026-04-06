package com.finance.finance_backend.service;

import com.finance.finance_backend.dto.DashboardSummaryDto;
import com.finance.finance_backend.entity.RecordType;
import com.finance.finance_backend.entity.User;
import com.finance.finance_backend.repository.FinancialRecordRepository;
import com.finance.finance_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FinancialRecordRepository repository;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).map(User::getId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public DashboardSummaryDto getSummary() {
        Long userId = getCurrentUserId();
        BigDecimal totalIncome = repository.getTotalByTypeAndUserId(RecordType.INCOME, userId);
        BigDecimal totalExpense = repository.getTotalByTypeAndUserId(RecordType.EXPENSE, userId);
        BigDecimal netBalance = totalIncome.subtract(totalExpense);

        return DashboardSummaryDto.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(netBalance)
                .build();
    }
}
