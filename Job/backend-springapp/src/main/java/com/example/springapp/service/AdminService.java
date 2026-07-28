package com.example.springapp.service;

import com.example.springapp.model.Applicant;
import com.example.springapp.model.Job;
import com.example.springapp.model.JobApplied;
import com.example.springapp.model.Payment;

import java.util.List;

public interface AdminService {

    Job addJob(Job job);

    Job editJob(Long id, Job job);

    void deleteJob(Long id);

    List<Applicant> getApplicants();

    void deleteApplicant(Long id);

    JobApplied updateApplicationStatus(Long jobAppliedId, String status);

    // size <= 0 returns the full unpaginated list (backward compatible default)
    List<JobApplied> getAllApplications(int page, int size);

    void deleteApplication(Long id);

    List<Payment> getPayments();

    void deletePayment(Long id);
}
