package com.example.springapp.controller;

import com.example.springapp.dto.StatusUpdateRequest;
import com.example.springapp.model.Applicant;
import com.example.springapp.model.Job;
import com.example.springapp.model.JobApplied;
import com.example.springapp.model.Payment;
import com.example.springapp.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

// Everything under /api/admin/** requires the ADMIN authority (see SecurityConfig)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/jobs")
    public ResponseEntity<Job> addJob(@Valid @RequestBody Job job) {
        return new ResponseEntity<>(adminService.addJob(job), HttpStatus.CREATED);
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<Job> editJob(@PathVariable Long id, @Valid @RequestBody Job job) {
        return ResponseEntity.ok(adminService.editJob(id, job));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Long id) {
        adminService.deleteJob(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted"));
    }

    @GetMapping("/applicants")
    public ResponseEntity<List<Applicant>> getApplicants() {
        return ResponseEntity.ok(adminService.getApplicants());
    }

    @DeleteMapping("/applicants/{id}")
    public ResponseEntity<Map<String, String>> deleteApplicant(@PathVariable Long id) {
        adminService.deleteApplicant(id);
        return ResponseEntity.ok(Map.of("message", "Applicant deleted"));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplied>> getAllApplications(@RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(adminService.getAllApplications(page, size));
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<Map<String, String>> deleteApplication(@PathVariable Long id) {
        adminService.deleteApplication(id);
        return ResponseEntity.ok(Map.of("message", "Application deleted"));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<JobApplied> updateApplicationStatus(@PathVariable Long id,
                                                              @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateApplicationStatus(id, request.getStatus()));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getPayments() {
        return ResponseEntity.ok(adminService.getPayments());
    }

    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Map<String, String>> deletePayment(@PathVariable Long id) {
        adminService.deletePayment(id);
        return ResponseEntity.ok(Map.of("message", "Payment deleted"));
    }
}
