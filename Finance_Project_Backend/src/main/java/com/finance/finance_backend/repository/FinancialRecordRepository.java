package com.finance.finance_backend.repository;

import com.finance.finance_backend.entity.FinancialRecord;
import com.finance.finance_backend.entity.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long> {
    List<FinancialRecord> findByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FinancialRecord f WHERE f.type = :type AND f.userId = :userId")
    BigDecimal getTotalByTypeAndUserId(@Param("type") RecordType type, @Param("userId") Long userId);
}
