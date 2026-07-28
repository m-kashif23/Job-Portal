package com.example.springapp.serviceImpl;

import com.example.springapp.model.Applicant;
import com.example.springapp.model.Job;
import com.example.springapp.model.JobApplied;
import com.example.springapp.model.Payment;
import com.example.springapp.repository.ApplicantRepository;
import com.example.springapp.repository.JobAppliedRepository;
import com.example.springapp.repository.JobRepository;
import com.example.springapp.repository.PaymentRepository;
import com.example.springapp.service.ApplicantService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicantServiceImpl implements ApplicantService {

    private final ApplicantRepository applicantRepository;
    private final JobRepository jobRepository;
    private final JobAppliedRepository jobAppliedRepository;
    private final PaymentRepository paymentRepository;

    @Value("${app.resume.storage-dir}")
    private String resumeStorageDir;

    public ApplicantServiceImpl(ApplicantRepository applicantRepository,
                                JobRepository jobRepository,
                                JobAppliedRepository jobAppliedRepository,
                                PaymentRepository paymentRepository) {
        this.applicantRepository = applicantRepository;
        this.jobRepository = jobRepository;
        this.jobAppliedRepository = jobAppliedRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Applicant addApplicant(Applicant applicant) {
        // The applicant profile must belong to the signed-in account: no applying under someone else's email
        String accountEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (applicant.getEmail() == null || !applicant.getEmail().equalsIgnoreCase(accountEmail)) {
            throw new IllegalArgumentException("The email on your applicant profile must match the email you signed in with");
        }
        if (applicantRepository.existsByEmail(applicant.getEmail())) {
            throw new IllegalStateException("An applicant with this email already exists");
        }
        applicant.setId(null);
        return applicantRepository.save(applicant);
    }

    @Override
    public Applicant getApplicant(Long id) {
        return applicantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Applicant not found: " + id));
    }

    @Override
    public Applicant getApplicantByEmail(String email) {
        return applicantRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Applicant not found for email: " + email));
    }

    @Override
    public List<Job> getJobs(int page, int size) {
        if (size <= 0) {
            return jobRepository.findAll();
        }
        return jobRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    @Override
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + id));
    }

    @Override
    public List<Job> getJobsByCategory(String category) {
        return jobRepository.findByCategoryIgnoreCase(category);
    }

    @Override
    public List<Job> searchJobsByTitle(String title) {
        return jobRepository.findByJobTitleContainingIgnoreCase(title);
    }

    @Override
    public JobApplied applyToJob(Long applicantId, Long jobId) {
        Applicant applicant = getApplicant(applicantId);

        // Prevent applying through an applicant profile that isn't the signed-in account's own
        String accountEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!applicant.getEmail().equalsIgnoreCase(accountEmail)) {
            throw new IllegalStateException("You can only apply using the applicant profile that matches your account email");
        }

        Job job = getJobById(jobId);

        if (jobAppliedRepository.existsByApplicantIdAndJobId(applicantId, jobId)) {
            throw new IllegalStateException("Applicant has already applied to this job");
        }
        if (job.getDeadLine() != null && job.getDeadLine().isBefore(LocalDate.now())) {
            throw new IllegalStateException("The application deadline for this job has passed");
        }

        JobApplied application = new JobApplied();
        application.setApplicant(applicant);
        application.setJob(job);
        application.setAppliedDate(LocalDate.now());
        application.setStatus("APPLIED");
        return jobAppliedRepository.save(application);
    }

    @Override
    public List<JobApplied> getApplications(Long applicantId) {
        getApplicant(applicantId); // 404 if the applicant does not exist
        return jobAppliedRepository.findByApplicantId(applicantId);
    }

    @Override
    public List<Job> getAppliedJobsByCategory(Long applicantId, String category) {
        return getApplications(applicantId).stream()
                .map(JobApplied::getJob)
                .filter(job -> category.equalsIgnoreCase(job.getCategory()))
                .collect(Collectors.toList());
    }

    @Override
    public Payment createPayment(Long applicantId, Long jobId, Payment payment) {
        Applicant applicant = getApplicant(applicantId);
        Job job = getJobById(jobId);

        Integer fee = job.getApplicationFee();
        if (fee == null || fee <= 0) {
            throw new IllegalStateException("This job has no application fee. Payment is not required.");
        }

        // The amount must be exactly the job's application fee - nothing more, nothing less
        if (payment.getTotalAmount() == null || !payment.getTotalAmount().equals(fee)) {
            throw new IllegalArgumentException(
                    "Payment amount must be exactly the job application fee: " + fee);
        }

        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDate.now());
        }
        if (payment.getStatus() == null) {
            payment.setStatus("SUCCESS");
        }

        // One payment per applicant per job. Re-paying the same job updates that
        // job's payment record; paying for a different job creates a NEW record,
        // so earlier payments are no longer overridden.
        return paymentRepository.findByApplicant_IdAndJob_Id(applicantId, jobId)
                .map(existing -> {
                    existing.setModeOfPayment(payment.getModeOfPayment());
                    existing.setCardHolderName(payment.getCardHolderName());
                    existing.setTotalAmount(fee);
                    existing.setPaymentDate(payment.getPaymentDate());
                    existing.setStatus(payment.getStatus());
                    return paymentRepository.save(existing);
                })
                .orElseGet(() -> {
                    payment.setId(null);
                    payment.setApplicant(applicant);
                    payment.setJob(job);
                    payment.setTotalAmount(fee);
                    return paymentRepository.save(payment);
                });
    }

    @Override
    public Payment getPayment(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found: " + id));
    }

    @Override
    public Applicant uploadResume(Long applicantId, MultipartFile file) {
        Applicant applicant = getApplicant(applicantId);

        // Same rule as addApplicant: only the profile's own account may touch it
        String accountEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!applicant.getEmail().equalsIgnoreCase(accountEmail)) {
            throw new IllegalStateException("You can only upload a resume to your own applicant profile");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file is required");
        }

        try {
            Path dir = Paths.get(resumeStorageDir);
            Files.createDirectories(dir);

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume";
            String extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : "";
            String storedName = "applicant-" + applicantId + "-" + UUID.randomUUID() + extension;
            file.transferTo(dir.resolve(storedName));

            // Remove the previous file, if any, so re-uploads don't leave orphaned files behind
            if (applicant.getResumeStoredName() != null) {
                Files.deleteIfExists(dir.resolve(applicant.getResumeStoredName()));
            }

            applicant.setResumeFileName(originalName);
            applicant.setResumeContentType(file.getContentType());
            applicant.setResumeStoredName(storedName);
            return applicantRepository.save(applicant);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not store resume file", e);
        }
    }

    @Override
    public Resource downloadResume(Long applicantId) {
        Applicant applicant = getApplicant(applicantId);
        if (applicant.getResumeStoredName() == null) {
            throw new EntityNotFoundException("No resume uploaded for applicant: " + applicantId);
        }
        Resource resource = new FileSystemResource(Paths.get(resumeStorageDir).resolve(applicant.getResumeStoredName()));
        if (!resource.exists()) {
            throw new EntityNotFoundException("Resume file is missing on disk for applicant: " + applicantId);
        }
        return resource;
    }
}
