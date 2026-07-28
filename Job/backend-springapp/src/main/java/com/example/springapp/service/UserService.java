package com.example.springapp.service;

import com.example.springapp.model.User;
import com.example.springapp.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByEmail(email)
                .map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    /**
     * Public registration. Role is always forced to USER so nobody can
     * self-register as ADMIN (privilege escalation fix).
     * Throws IllegalStateException (mapped to 409) if email/username is taken.
     */
    public User registerUser(User user) {
        if (repository.existsByEmail(user.getEmail())) {
            throw new IllegalStateException("Email is already registered");
        }
        if (repository.existsByUsername(user.getUsername())) {
            throw new IllegalStateException("Username is already taken");
        }
        user.setRoles("USER");
        user.setPassword(encoder.encode(user.getPassword()));
        return repository.save(user);
    }

    public User getByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    // Email is intentionally not editable here: it's the login identifier and
    // must keep matching the Applicant profile it's tied to elsewhere in the app.
    public User updateProfile(String email, String newUsername, String mobileNumber) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        if (!newUsername.equals(user.getUsername()) && repository.existsByUsername(newUsername)) {
            throw new IllegalStateException("Username is already taken");
        }
        user.setUsername(newUsername);
        user.setMobileNumber(mobileNumber);
        return repository.save(user);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        if (!encoder.matches(currentPassword, user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        user.setPassword(encoder.encode(newPassword));
        repository.save(user);
    }

    public void deleteAccount(String email) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        repository.delete(user);
    }
}
