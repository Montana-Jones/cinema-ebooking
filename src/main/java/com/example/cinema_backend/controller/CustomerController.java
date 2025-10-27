package com.example.cinema_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.cinema_backend.model.Customer;
import com.example.cinema_backend.repository.CustomerRepository;
import com.example.cinema_backend.service.EmailService;
import com.example.cinema_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/customers")
// @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    // -------------------------------
    // GET all customers
    // -------------------------------
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // -------------------------------
    // GET customer by ID
    // -------------------------------
    @GetMapping("/{id}")
    public Optional<Customer> getCustomerById(@PathVariable String id) {
        return customerRepository.findById(id);
    }

    // -------------------------------
    // CREATE a new customer (signup)
    // -------------------------------
    @PostMapping("/signup")
    public Customer addCustomer(@RequestBody Customer newCustomer) {
        newCustomer.setId(null);
        newCustomer.setVerified(false);

        // Generate and send verification code
        String code = emailService.sendVerificationEmail(newCustomer.getEmail());
        newCustomer.setVerificationCode(code);

        return customerRepository.save(newCustomer);
    }

    // -------------------------------
    // VERIFY a customer
    // -------------------------------
    @PostMapping("/verify/{id}")
    public Customer verifyCustomer(@PathVariable String id, @RequestBody VerificationRequest request) {
        Optional<Customer> opt = customerRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("Customer not found with id: " + id);
        }

        Customer customer = opt.get();
        if (!customer.getVerificationCode().equals(request.getCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        customer.setVerified(true);
        customer.setVerificationCode(null); // clear code after verification
        return customerRepository.save(customer);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyCustomer(HttpServletRequest request) {
        // Get the token from the cookie
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No cookies found");
        }

        String token = null;
        for (Cookie cookie : cookies) {
            if ("token".equals(cookie.getName())) {
                token = cookie.getValue();
                break;
            }
        }

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token found");
        }

        try {
            // Validate token and extract email
            String email = jwtUtil.extractEmail(token);
            Customer customer = customerRepository.findByEmail(email);
            if (customer == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            customer.setPassword(null); // never send password
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    // -------------------------------
    // UPDATE customer by ID
    // -------------------------------
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable String id, @RequestBody Customer updatedCustomer) {
        Optional<Customer> opt = customerRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("Customer not found with id: " + id);
        }

        Customer customer = opt.get();
        boolean hasChanges = false;

        if (updatedCustomer.getFirstName() != null && !updatedCustomer.getFirstName().equals(customer.getFirstName())) {
            customer.setFirstName(updatedCustomer.getFirstName());
            hasChanges = true;
        }

        if (updatedCustomer.getLastName() != null && !updatedCustomer.getLastName().equals(customer.getLastName())) {
            customer.setLastName(updatedCustomer.getLastName());
            hasChanges = true;
        }

        if (updatedCustomer.getEmail() != null && !updatedCustomer.getEmail().equals(customer.getEmail())) {
            customer.setEmail(updatedCustomer.getEmail());
            hasChanges = true;
        }

        if (updatedCustomer.getPhoneNumber() != null
                && !updatedCustomer.getPhoneNumber().equals(customer.getPhoneNumber())) {
            customer.setPhoneNumber(updatedCustomer.getPhoneNumber());
            hasChanges = true;
        }

        if (updatedCustomer.getHomeAddress() != null
                && !updatedCustomer.getHomeAddress().equals(customer.getHomeAddress())) {
            customer.setHomeAddress(updatedCustomer.getHomeAddress());
            hasChanges = true;
        }

        if (updatedCustomer.getBillingAddress() != null
                && !updatedCustomer.getBillingAddress().equals(customer.getBillingAddress())) {
            customer.setBillingAddress(updatedCustomer.getBillingAddress());
            hasChanges = true;
        }

        if (updatedCustomer.getPassword() != null && !updatedCustomer.getPassword().equals(customer.getPassword())) {
            customer.setPassword(updatedCustomer.getPassword());
            hasChanges = true;
        }

        if (updatedCustomer.getPaymentInfo() != null
                && !updatedCustomer.getPaymentInfo().equals(customer.getPaymentInfo())) {
            customer.setPaymentInfo(updatedCustomer.getPaymentInfo());
            hasChanges = true;
        }

        if (!hasChanges) {
            return customer; // no changes
        }

        return customerRepository.save(customer);
    }

    // GET customer by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        customer.setPassword(null); // never return password
        return ResponseEntity.ok(customer);
    }

    // -------------------------------
    // DELETE customer by ID
    // -------------------------------
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerRepository.deleteById(id);
    }

    // -------------------------------
    // LOGIN endpoint
    // -------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(@RequestBody Customer loginRequest, HttpServletResponse response) {
        Customer customer = customerRepository.findByEmail(loginRequest.getEmail());

        if (customer == null || !customer.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Generate token using JwtUtil
        String token = jwtUtil.generateToken(customer.getEmail());

        // Add HTTP-only cookie
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // change to true if using HTTPS
                .path("/")
                .sameSite("Strict")
                .maxAge(24 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Send customer info (without password)
        customer.setPassword(null);
        return ResponseEntity.ok(customer);
    }

    // -------------------------------
    // DTOs
    // -------------------------------
    public static class VerificationRequest {
        private String code;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class LoginResponse {
        private String token;
        private Customer customer;

        public LoginResponse(String token, Customer customer) {
            this.token = token;
            this.customer = customer;
        }

        public String getToken() {
            return token;
        }

        public Customer getCustomer() {
            return customer;
        }
    }
}
