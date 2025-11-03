
package com.example.cinema_backend.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.example.cinema_backend.repository.UserRepository;
import com.example.cinema_backend.security.AESUtil;
import com.example.cinema_backend.model.User;
import com.example.cinema_backend.service.UserService;


@RestController
@RequestMapping("/api/users") // or keep /api/customers for compatibility
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

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
    
    @PostMapping("/verify-password/{email}")
    public boolean verifyPassword(@PathVariable String email, @RequestBody Map<String, String> body) {
        return userService.verifyPassword(email, body); 
    }

    @PutMapping("/email/{email}")
    public User updateUserByEmail(@PathVariable String email, @RequestBody User updated) {
        return userService.updateUserByEmail(email, updated);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        return userService.forgotPassword(body);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        return userService.resetPassword(body);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserService.LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User u) {
        return userService.signup(u);   
    }

    @PostMapping("/verify/{id}")
    public ResponseEntity<?> verify(@PathVariable String id, @RequestBody UserService.VerificationRequest req) {
        return userService.verify(id, req); 
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

}
