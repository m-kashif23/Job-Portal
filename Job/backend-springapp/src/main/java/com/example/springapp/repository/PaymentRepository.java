package com.example.springapp.repository;

import com.example.springapp.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByApplicant_Id(Long applicantId);

    Optional<Payment> findByApplicant_IdAndJob_Id(Long applicantId, Long jobId);

    void deleteByApplicant_Id(Long applicantId);

    void deleteByJob_Id(Long jobId);
}
