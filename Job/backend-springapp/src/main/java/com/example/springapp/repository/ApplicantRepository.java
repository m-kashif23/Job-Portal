package com.example.springapp.repository;

import com.example.springapp.model.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {

    boolean existsByEmail(String email);

    Optional<Applicant> findByEmail(String email);
}
