package com.example.springapp.controller;

import com.example.springapp.model.Applicant;
import com.example.springapp.model.Job;
import com.example.springapp.model.JobApplied;
import com.example.springapp.model.Payment;
import com.example.springapp.service.ApplicantService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// Everything under /api/** requires a valid JWT (any authenticated user)
@RestController
@RequestMapping("/api")
public class ApplicantController {

    private final ApplicantService applicantService;

    public ApplicantController(ApplicantService applicantService) {
        this.applicantService = applicantService;
    }

    // ---- Jobs (browse) ----

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getJobs(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(applicantService.getJobs(page, size));
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(applicantService.getJobById(id));
    }

    // category = "free" or "premium"
    @GetMapping("/jobs/category/{category}")
    public ResponseEntity<List<Job>> getJobsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(applicantService.getJobsByCategory(category));
    }

    @GetMapping("/jobs/search/{title}")
    public ResponseEntity<List<Job>> searchJobsByTitle(@PathVariable String title) {
        return ResponseEntity.ok(applicantService.searchJobsByTitle(title));
    }

    // ---- Applicants ----

    @PostMapping("/applicants")
    public ResponseEntity<Applicant> addApplicant(@Valid @RequestBody Applicant applicant) {
        return new ResponseEntity<>(applicantService.addApplicant(applicant), HttpStatus.CREATED);
    }

    @GetMapping("/applicants/{id}")
    public ResponseEntity<Applicant> getApplicant(@PathVariable Long id) {
        return ResponseEntity.ok(applicantService.getApplicant(id));
    }

    @GetMapping("/applicants/by-email")
    public ResponseEntity<Applicant> getApplicantByEmail(@RequestParam String email) {
        return ResponseEntity.ok(applicantService.getApplicantByEmail(email));
    }

    // ---- Resume ----

    @PostMapping("/applicants/{id}/resume")
    public ResponseEntity<Applicant> uploadResume(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(applicantService.uploadResume(id, file));
    }

    @GetMapping("/applicants/{id}/resume")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) {
        Applicant applicant = applicantService.getApplicant(id);
        Resource resource = applicantService.downloadResume(id);
        String contentType = applicant.getResumeContentType() != null
                ? applicant.getResumeContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + applicant.getResumeFileName() + "\"")
                .body(resource);
    }

    // ---- Applications ----

    @PostMapping("/applicants/{applicantId}/apply/{jobId}")
    public ResponseEntity<JobApplied> applyToJob(@PathVariable Long applicantId, @PathVariable Long jobId) {
        return new ResponseEntity<>(applicantService.applyToJob(applicantId, jobId), HttpStatus.CREATED);
    }

    @GetMapping("/applicants/{id}/applications")
    public ResponseEntity<List<JobApplied>> getApplications(@PathVariable Long id) {
        return ResponseEntity.ok(applicantService.getApplications(id));
    }

    // Jobs this applicant applied to, filtered by category
    @GetMapping("/applicants/{id}/jobs/{category}")
    public ResponseEntity<List<Job>> getAppliedJobsByCategory(@PathVariable Long id,
                                                              @PathVariable String category) {
        return ResponseEntity.ok(applicantService.getAppliedJobsByCategory(id, category));
    }

    // ---- Payments ----

    @PostMapping("/applicants/{applicantId}/jobs/{jobId}/payments")
    public ResponseEntity<Payment> createPayment(@PathVariable Long applicantId,
                                                 @PathVariable Long jobId,
                                                 @RequestBody Payment payment) {
        return new ResponseEntity<>(applicantService.createPayment(applicantId, jobId, payment), HttpStatus.CREATED);
    }

    @GetMapping("/payments/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        return ResponseEntity.ok(applicantService.getPayment(id));
    }
}
