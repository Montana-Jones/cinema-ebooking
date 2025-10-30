package com.example.cinema_backend.controller;

import com.example.cinema_backend.model.Admin;
import com.example.cinema_backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*") // allow frontend access (adjust for security later)
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    //  Get all admins
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    //  Get admin by ID
    @GetMapping("/{id}")
    public Optional<Admin> getAdminById(@PathVariable String id) {
        return adminRepository.findById(id);
    }

    //  Get admin by email (optional)
    @GetMapping("/email/{email}")
    public Optional<Admin> getAdminByEmail(@PathVariable String email) {
        return adminRepository.findByEmail(email);
    }

    //  Create a new admin
    @PostMapping
    public Admin createAdmin(@RequestBody Admin admin) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        admin.setPassword(encoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    @PostMapping("/login")
    public String login(@RequestBody Admin loginRequest) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        Admin admin = adminRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (encoder.matches(loginRequest.getPassword(), admin.getPassword())) {
            return "Login successful";
        } else {
            return "Invalid password";
        }
    }


    //  Update an admin
    @PutMapping("/{id}")
    public Admin updateAdmin(@PathVariable String id, @RequestBody Admin updatedAdmin) {
        return adminRepository.findById(id)
                .map(admin -> {
                    admin.setEmail(updatedAdmin.getEmail());
                    admin.setPassword(updatedAdmin.getPassword());
                    return adminRepository.save(admin);
                })
                .orElseThrow(() -> new RuntimeException("Admin not found with id " + id));
    }

    //  Delete an admin
    @DeleteMapping("/{id}")
    public String deleteAdmin(@PathVariable String id) {
        adminRepository.deleteById(id);
        return "Admin deleted with id: " + id;
    }
}