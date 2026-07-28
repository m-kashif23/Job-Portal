package com.example.springapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String applicantName;
    @NotBlank
    private String contactNumber;

    @NotBlank
    @Email
    @Column(unique = true, nullable = false)
    private String email;

    // Resume: original filename shown to the user, its content type, and the
    // generated name it's actually stored under on disk (app.resume.storage-dir)
    private String resumeFileName;
    private String resumeContentType;
    private String resumeStoredName;

    public Applicant() {
    }

    public Applicant(Long id, String applicantName, String contactNumber, String email) {
        this.id = id;
        this.applicantName = applicantName;
        this.contactNumber = contactNumber;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public String getResumeContentType() {
        return resumeContentType;
    }

    public void setResumeContentType(String resumeContentType) {
        this.resumeContentType = resumeContentType;
    }

    public String getResumeStoredName() {
        return resumeStoredName;
    }

    public void setResumeStoredName(String resumeStoredName) {
        this.resumeStoredName = resumeStoredName;
    }
}
