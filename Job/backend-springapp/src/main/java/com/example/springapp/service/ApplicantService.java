package com.example.springapp.service;

import com.example.springapp.model.Applicant;
import com.example.springapp.model.Job;
import com.example.springapp.model.JobApplied;
import com.example.springapp.model.Payment;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ApplicantService {

    Applicant addApplicant(Applicant applicant);

    Applicant getApplicant(Long id);

    Applicant getApplicantByEmail(String email);

    // size <= 0 returns the full unpaginated list (backward compatible default)
    List<Job> getJobs(int page, int size);

    Job getJobById(Long id);

    List<Job> getJobsByCategory(String category);

    List<Job> searchJobsByTitle(String title);

    JobApplied applyToJob(Long applicantId, Long jobId);

    List<JobApplied> getApplications(Long applicantId);

    List<Job> getAppliedJobsByCategory(Long applicantId, String category);

    Payment createPayment(Long applicantId, Long jobId, Payment payment);

    Payment getPayment(Long id);

    // ---- Resume ----

    Applicant uploadResume(Long applicantId, MultipartFile file);

    Resource downloadResume(Long applicantId);
}
