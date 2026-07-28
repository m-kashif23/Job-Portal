package com.example.springapp.serviceImpl;

import com.example.springapp.model.Applicant;
import com.example.springapp.model.Job;
import com.example.springapp.model.JobApplied;
import com.example.springapp.model.Payment;
import com.example.springapp.repository.ApplicantRepository;
import com.example.springapp.repository.JobAppliedRepository;
import com.example.springapp.repository.JobRepository;
import com.example.springapp.repository.PaymentRepository;
import com.example.springapp.service.AdminService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final ApplicantRepository applicantRepository;
    private final JobRepository jobRepository;
    private final JobAppliedRepository jobAppliedRepository;
    private final PaymentRepository paymentRepository;

    public AdminServiceImpl(ApplicantRepository applicantRepository,
                            JobRepository jobRepository,
                            JobAppliedRepository jobAppliedRepository,
                            PaymentRepository paymentRepository) {
        this.applicantRepository = applicantRepository;
        this.jobRepository = jobRepository;
        this.jobAppliedRepository = jobAppliedRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Job addJob(Job job) {
        job.setId(null); // always create, never overwrite by client-supplied id
        return jobRepository.save(job);
    }

    @Override
    public Job editJob(Long id, Job job) {
        Job existing = jobRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + id));
        existing.setJobTitle(job.getJobTitle());
        existing.setDepartment(job.getDepartment());
        existing.setLocation(job.getLocation());
        existing.setResponsibility(job.getResponsibility());
        existing.setQualification(job.getQualification());
        existing.setDeadLine(job.getDeadLine());
        existing.setApplicationFee(job.getApplicationFee());
        existing.setCategory(job.getCategory());
        return jobRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new EntityNotFoundException("Job not found: " + id);
        }
        // job_applied and payment both have foreign keys to job with no cascade.
        // Remove the dependents first, then the job.
        jobAppliedRepository.deleteByJobId(id);
        paymentRepository.deleteByJob_Id(id);
        jobRepository.deleteById(id);
    }

    @Override
    public List<Applicant> getApplicants() {
        return applicantRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteApplicant(Long id) {
        if (!applicantRepository.existsById(id)) {
            throw new EntityNotFoundException("Applicant not found: " + id);
        }
        // Same FK situation as jobs: applications and payments reference the applicant
        jobAppliedRepository.deleteByApplicantId(id);
        paymentRepository.deleteByApplicant_Id(id);
        applicantRepository.deleteById(id);
    }

    @Override
    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new EntityNotFoundException("Payment not found: " + id);
        }
        paymentRepository.deleteById(id);
    }

    @Override
    public JobApplied updateApplicationStatus(Long jobAppliedId, String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }
        String normalized = status.trim().toUpperCase();
        List<String> allowed = List.of("APPLIED", "SHORTLISTED", "SELECTED", "REJECTED");
        if (!allowed.contains(normalized)) {
            throw new IllegalArgumentException("Invalid status. Allowed values: " + allowed);
        }
        JobApplied application = jobAppliedRepository.findById(jobAppliedId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found: " + jobAppliedId));
        application.setStatus(normalized);
        return jobAppliedRepository.save(application);
    }

    @Override
    public List<JobApplied> getAllApplications(int page, int size) {
        if (size <= 0) {
            return jobAppliedRepository.findAll();
        }
        return jobAppliedRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    @Override
    public void deleteApplication(Long id) {
        if (!jobAppliedRepository.existsById(id)) {
            throw new EntityNotFoundException("Application not found: " + id);
        }
        jobAppliedRepository.deleteById(id);
    }

    @Override
    public List<Payment> getPayments() {
        return paymentRepository.findAll();
    }
}
