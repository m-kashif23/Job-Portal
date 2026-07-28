package com.example.springapp.repository;

import com.example.springapp.model.JobApplied;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobAppliedRepository extends JpaRepository<JobApplied, Long> {

    List<JobApplied> findByApplicantId(Long applicantId);

    boolean existsByApplicantIdAndJobId(Long applicantId, Long jobId);

    List<JobApplied> findByJobId(Long jobId);

    void deleteByJobId(Long jobId);

    void deleteByApplicantId(Long applicantId);
}
