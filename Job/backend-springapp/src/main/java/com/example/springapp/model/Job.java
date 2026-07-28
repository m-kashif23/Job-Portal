package com.example.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String jobTitle;
    @NotBlank
    private String department;
    @NotBlank
    private String location;
    private String responsibility;
    private String qualification;
    @NotNull
    private LocalDate deadLine;
    @PositiveOrZero
    private Integer applicationFee;

    // "free" or "premium"
    @Pattern(regexp = "free|premium", flags = Pattern.Flag.CASE_INSENSITIVE)
    private String category;

    public Job() {
    }

    public Job(Long id, String jobTitle, String department, String location, String responsibility,
               String qualification, LocalDate deadLine, Integer applicationFee, String category) {
        this.id = id;
        this.jobTitle = jobTitle;
        this.department = department;
        this.location = location;
        this.responsibility = responsibility;
        this.qualification = qualification;
        this.deadLine = deadLine;
        this.applicationFee = applicationFee;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(String responsibility) {
        this.responsibility = responsibility;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public LocalDate getDeadLine() {
        return deadLine;
    }

    public void setDeadLine(LocalDate deadLine) {
        this.deadLine = deadLine;
    }

    public Integer getApplicationFee() {
        return applicationFee;
    }

    public void setApplicationFee(Integer applicationFee) {
        this.applicationFee = applicationFee;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
