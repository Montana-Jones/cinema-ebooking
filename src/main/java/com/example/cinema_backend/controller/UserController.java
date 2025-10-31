package com.example.cinema_backend.controller;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.cinema_backend.model.User;
import com.example.cinema_backend.model.Status;
import com.example.cinema_backend.repository.UserRepository;
import com.example.cinema_backend.service.EmailService;
import com.example.cinema_backend.security.AESUtil;
import com.example.cinema_backend.util.JwtUtil;

@RestController
@RequestMapping("/api/users") // or keep /api/customers for compatibility
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired private EmailService emailService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/verify-password/{email}")
    public boolean verifyPassword(@PathVariable String email, @RequestBody Map<String, String> body) {
        String oldPassword = body.get("oldPassword");
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) return false;
        return passwordEncoder.matches(oldPassword, opt.get().getPassword());
    }

    @GetMapping
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(this::decryptAndMaskPaymentInfo);
        return users;
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable String id) {
        Optional<User> u = userRepository.findById(id);
        u.ifPresent(this::decryptAndMaskPaymentInfo);
        return u;
    }

    @GetMapping("/email/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        Optional<User> u = userRepository.findByEmail(email);
        u.ifPresent(this::decryptAndMaskPaymentInfo);
        return u;
    }

    @PutMapping("/email/{email}")
    public User updateUserByEmail(@PathVariable String email, @RequestBody User updated) {
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) throw new RuntimeException("User not found: " + email);

        User user = opt.get();
        boolean changed = false;
        StringBuilder sb = new StringBuilder("Hello " + user.getFirstName() + ",\n\nChanges:\n");

        if (updated.getFirstName() != null && !updated.getFirstName().equals(user.getFirstName())) {
            user.setFirstName(updated.getFirstName());
            sb.append("- First name\n");
            changed = true;
        }
        if (updated.getLastName() != null && !updated.getLastName().equals(user.getLastName())) {
            user.setLastName(updated.getLastName());
            sb.append("- Last name\n");
            changed = true;
        }
        if (updated.getPassword() != null && !passwordEncoder.matches(updated.getPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(updated.getPassword()));
            sb.append("- Password\n");
            changed = true;
        }
        if (updated.getPhoneNumber() != null && !updated.getPhoneNumber().equals(user.getPhoneNumber())) {
            user.setPhoneNumber(updated.getPhoneNumber());
            sb.append("- Phone\n");
            changed = true;
        }
        if (updated.getHomeAddress() != null && !updated.getHomeAddress().equals(user.getHomeAddress())) {
            user.setHomeAddress(updated.getHomeAddress());
            sb.append("- Home address\n");
            changed = true;
        }
        if (updated.getBillingAddress() != null && !updated.getBillingAddress().equals(user.getBillingAddress())) {
            user.setBillingAddress(updated.getBillingAddress());
            sb.append("- Billing address\n");
            changed = true;
        }
        if (updated.getPromotion() != null && !updated.getPromotion().equals(user.getPromotion())) {
            user.setPromotion(updated.getPromotion());
            sb.append("- Promotion\n");
            changed = true;
        }

        if (updated.getPaymentInfo() != null) {
            updated.getPaymentInfo().forEach(p -> {
                if (p.getCardNumber() != null) p.setCardNumber(AESUtil.encrypt(p.getCardNumber()));
                if (p.getCvv() != null) p.setCvv(AESUtil.encrypt(p.getCvv()));
            });
            user.setPaymentInfo(updated.getPaymentInfo());
            sb.append("- Payment info\n");
            changed = true;
        }

        if (!changed) return user;

        User saved = userRepository.save(user);

        try {
            sb.append("\nIf this wasn't you, contact support.\nCinema Team");
            emailService.sendEmail(user.getEmail(), "Account Update", sb.toString());
        } catch (Exception ignore) {}

        return saved;
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("password");
        if (token == null || newPassword == null) return ResponseEntity.badRequest().body("Missing fields");

        Optional<User> opt = userRepository.findByResetToken(token);
        if (opt.isEmpty() || opt.get().getTokenExpiration().isBefore(LocalDateTime.now()))
            return ResponseEntity.badRequest().body("Invalid or expired token");

        User u = opt.get();
        u.setPassword(passwordEncoder.encode(newPassword));
        u.setResetToken(null);
        u.setTokenExpiration(null);
        userRepository.save(u);

        return ResponseEntity.ok("Password updated");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");

        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("User not found");

        User user = opt.get();
        if (!passwordEncoder.matches(password, user.getPassword()))
            return ResponseEntity.status(401).body("Invalid password");

        decryptAndMaskPaymentInfo(user);
        user.setPassword(null);

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new LoginResponse(token, user.getEmail(), user.isAdmin()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User u) {
        Optional<User> existing = userRepository.findByEmail(u.getEmail());
        if (existing.isPresent()) return ResponseEntity.status(409).body("Email exists");

        u.setPassword(passwordEncoder.encode(u.getPassword()));

        if (u.getPaymentInfo() != null) {
            u.getPaymentInfo().forEach(p -> {
                if (p.getCardNumber() != null) p.setCardNumber(AESUtil.encrypt(p.getCardNumber()));
                if (p.getCvv() != null) p.setCvv(AESUtil.encrypt(p.getCvv()));
            });
        }

        u.setId(null);
        u.setStatus(Status.UNVERIFIED);
        u.setVerified(false);
        u.setRole("CUSTOMER");

        String code = emailService.sendVerificationEmail(u.getEmail());
        u.setVerificationCode(code);

        return ResponseEntity.ok(userRepository.save(u));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
    }

    @PostMapping("/verify/{id}")
    public ResponseEntity<?> verify(@PathVariable String id, @RequestBody VerificationRequest req) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        User u = opt.get();
        if (!u.getVerificationCode().equals(req.getCode())) return ResponseEntity.badRequest().body("Invalid code");

        u.setVerified(true);
        u.setStatus(Status.ACTIVE);
        u.setVerificationCode(null);
        userRepository.save(u);

        return ResponseEntity.ok("Verified");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) return ResponseEntity.ok().build();

        User u = opt.get();
        String token = UUID.randomUUID().toString();
        u.setResetToken(token);
        u.setTokenExpiration(LocalDateTime.now().plusHours(2));
        userRepository.save(u);

        String link = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendPasswordReset(email, link);

        return ResponseEntity.ok().build();
    }

    private void decryptAndMaskPaymentInfo(User u) {
        if (u.getPaymentInfo() == null) return;
        u.getPaymentInfo().forEach(p -> {
            try {
                if (p.getCardNumber() != null) {
                    p.setCardNumber(AESUtil.decrypt(p.getCardNumber()));
                    if (p.getCardNumber().length() > 4) {
                        String last4 = p.getCardNumber().substring(p.getCardNumber().length() - 4);
                        p.setCardNumber("**** **** **** " + last4);
                    }
                }
                if (p.getCvv() != null) p.setCvv("***");
            } catch (Exception ignored) {}
        });
    }

    public static class VerificationRequest { 
        private String code;
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }
    public record LoginResponse(String token, String email, boolean isAdmin) {}
}
