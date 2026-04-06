package com.finance.finance_backend.service;

import com.finance.finance_backend.dto.DashboardSummaryDto;
import com.finance.finance_backend.entity.RecordType;
import com.finance.finance_backend.repository.FinancialRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FinancialRecordRepository repository;

    public DashboardSummaryDto getSummary() {
        BigDecimal totalIncome = repository.getTotalByType(RecordType.INCOME);
        BigDecimal totalExpense = repository.getTotalByType(RecordType.EXPENSE);
        BigDecimal netBalance = totalIncome.subtract(totalExpense);

        return DashboardSummaryDto.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(netBalance)
                .build();
    }
}
