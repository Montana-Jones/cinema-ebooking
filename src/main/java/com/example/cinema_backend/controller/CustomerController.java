package com.example.cinema_backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.cinema_backend.model.Customer;
import com.example.cinema_backend.model.Status;
import com.example.cinema_backend.repository.CustomerRepository;
import com.example.cinema_backend.service.EmailService;
import com.example.cinema_backend.security.AESUtil;
import com.example.cinema_backend.util.JwtUtil;


@RestController
@RequestMapping("/api/customers")
//@CrossOrigin(origins = "*")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // -------------------------------
    // Verify password
    // -------------------------------
    @PostMapping("/verify-password/{email}")
    public boolean verifyPassword(@PathVariable String email, @RequestBody Map<String, String> body) {
        String oldPassword = body.get("oldPassword");
        Optional<Customer> opt = customerRepository.findByEmail(email);
        if (opt.isEmpty()) return false;

        Customer customer = opt.get();
        return passwordEncoder.matches(oldPassword, customer.getPassword());
    }

    // -------------------------------
    // GET all customers
    // -------------------------------
    @GetMapping
    public List<Customer> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        customers.forEach(this::decryptAndMaskPaymentInfo);
        return customers;
    }

    // -------------------------------
    // GET customer by ID
    // -------------------------------
    @GetMapping("/{id}")
    public Optional<Customer> getCustomerById(@PathVariable String id) {
        Optional<Customer> customer = customerRepository.findById(id);
        customer.ifPresent(this::decryptAndMaskPaymentInfo);
        return customer;
    }

    // -------------------------------
    // GET customer by email
    // -------------------------------
    @GetMapping("/email/{email}")
    public Optional<Customer> getCustomerByEmail(@PathVariable String email) {
        Optional<Customer> customer = customerRepository.findByEmail(email);
        customer.ifPresent(this::decryptAndMaskPaymentInfo);
        return customer;
    }

    // -------------------------------
    // UPDATE customer by email
    // -------------------------------
    @PutMapping("/email/{email}")
    public Customer updateCustomerByEmail(@PathVariable String email, @RequestBody Customer updatedCustomer) {
        Optional<Customer> opt = customerRepository.findByEmail(email);
        if (opt.isEmpty()) throw new RuntimeException("Customer not found with email: " + email);

        Customer customer = opt.get();
        boolean hasChanges = false;
        StringBuilder changeSummary = new StringBuilder("Hello " + customer.getFirstName() + ",\n\n");
        changeSummary.append("The following changes were made to your account:\n");

        if (updatedCustomer.getFirstName() != null && !updatedCustomer.getFirstName().equals(customer.getFirstName())) {
            customer.setFirstName(updatedCustomer.getFirstName());
            changeSummary.append("- First name updated\n");
            hasChanges = true;
        }
        if (updatedCustomer.getLastName() != null && !updatedCustomer.getLastName().equals(customer.getLastName())) {
            customer.setLastName(updatedCustomer.getLastName());
            changeSummary.append("- Last name updated\n");
            hasChanges = true;
        }
        if (updatedCustomer.getPassword() != null 
                && !passwordEncoder.matches(updatedCustomer.getPassword(), customer.getPassword())) {
            customer.setPassword(passwordEncoder.encode(updatedCustomer.getPassword()));
            changeSummary.append("- Password changed\n");
            hasChanges = true;
        }
        if (updatedCustomer.getPhoneNumber() != null && !updatedCustomer.getPhoneNumber().equals(customer.getPhoneNumber())) {
            customer.setPhoneNumber(updatedCustomer.getPhoneNumber());
            changeSummary.append("- Phone number updated\n");
            hasChanges = true;
        }
        if (updatedCustomer.getHomeAddress() != null && !updatedCustomer.getHomeAddress().equals(customer.getHomeAddress())) {
            customer.setHomeAddress(updatedCustomer.getHomeAddress());
            changeSummary.append("- Home address updated\n");
            hasChanges = true;
        }
        if (updatedCustomer.getBillingAddress() != null && !updatedCustomer.getBillingAddress().equals(customer.getBillingAddress())) {
            customer.setBillingAddress(updatedCustomer.getBillingAddress());
            changeSummary.append("- Billing address updated\n");
            hasChanges = true;
        }
        if (updatedCustomer.getPromotion() != null && !updatedCustomer.getPromotion().equals(customer.getPromotion())) {
            customer.setPromotion(updatedCustomer.getPromotion());
            changeSummary.append("- Promotion preference updated\n");
            hasChanges = true;
        }

        // Encrypt payment info before saving
        if (updatedCustomer.getPaymentInfo() != null) {
            updatedCustomer.getPaymentInfo().forEach(p -> {
                if (p.getCardNumber() != null && !p.getCardNumber().isEmpty())
                    p.setCardNumber(AESUtil.encrypt(p.getCardNumber()));
                if (p.getCvv() != null && !p.getCvv().isEmpty())
                    p.setCvv(AESUtil.encrypt(p.getCvv()));
            });
            customer.setPaymentInfo(updatedCustomer.getPaymentInfo());
            changeSummary.append("- Payment methods updated\n");
            hasChanges = true;
        }

        if (!hasChanges) return customer;

        Customer saved = customerRepository.save(customer);

        // Email notification
        try {
            changeSummary.append("\nIf you didn’t make these changes, please contact support immediately.\n\n");
            changeSummary.append("Best regards,\nCinema Team");
            emailService.sendEmail(customer.getEmail(), "Account Update Notification", changeSummary.toString());
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }

        return saved;
    }

    // -------------------------------
    // RESET PASSWORD
    // -------------------------------
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            String newPassword = body.get("password");

            if (token == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Missing token or password");
            }

            Optional<Customer> opt = customerRepository.findByResetToken(token);
            if (opt.isEmpty() || opt.get().getTokenExpiration().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body("Invalid or expired token");
            }

            Customer user = opt.get();
            user.setPassword(passwordEncoder.encode(newPassword)); 
            user.setResetToken(null);
            user.setTokenExpiration(null);
            customerRepository.save(user);

            return ResponseEntity.ok("Password successfully updated");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error");
        }
    }


    // -------------------------------
    // LOGIN endpoint
    // -------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Optional<Customer> existingCustomer = customerRepository.findByEmail(email);
        if (existingCustomer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }

        Customer customer = existingCustomer.get();

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        decryptAndMaskPaymentInfo(customer);
        customer.setPassword(null); // hide password
        String token = jwtUtil.generateToken(customer.getEmail());
        return ResponseEntity.ok(new LoginResponse(token, customer.getEmail(), customer.isAdmin()));
    }

    // -------------------------------
    // ADD new customer
    // -------------------------------
    @PostMapping("/signup")
    public ResponseEntity<?> addCustomer(@RequestBody Customer newCustomer) {
        try {
            Optional<Customer> existing = customerRepository.findByEmail(newCustomer.getEmail());
            if (existing.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            }

            newCustomer.setPassword(passwordEncoder.encode(newCustomer.getPassword()));

            // Encrypt payment info
            if (newCustomer.getPaymentInfo() != null) {
                newCustomer.getPaymentInfo().forEach(p -> {
                    if (p.getCardNumber() != null && !p.getCardNumber().isEmpty())
                        p.setCardNumber(AESUtil.encrypt(p.getCardNumber()));
                    if (p.getCvv() != null && !p.getCvv().isEmpty())
                        p.setCvv(AESUtil.encrypt(p.getCvv()));
                });
            }
            newCustomer.setId(null);
            newCustomer.setStatus(Status.UNVERIFIED);
            newCustomer.setVerified(false);

            // Generate and send verification code
            String code = emailService.sendVerificationEmail(newCustomer.getEmail());
            newCustomer.setVerificationCode(code);
            //

            Customer savedCustomer = customerRepository.save(newCustomer);
            return ResponseEntity.ok(savedCustomer);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating customer: " + e.getMessage());
        }
    }

    // -------------------------------
    // DELETE customer
    // -------------------------------
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerRepository.deleteById(id);
    }

    @PostMapping("/verify/{id}")
    public ResponseEntity<?> verifyCustomer(@PathVariable String id, @RequestBody VerificationRequest request) {
        Optional<Customer> opt = customerRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body("Customer not found with id: " + id);
        }

        Customer customer = opt.get();
        if (!customer.getVerificationCode().equals(request.getCode())) {
            return ResponseEntity.badRequest().body("Invalid verification code");
        }

        customer.setVerified(true);
        customer.setStatus(Status.ACTIVE);
        customer.setVerificationCode(null);// clear code after verification
        customerRepository.save(customer);

        return ResponseEntity.ok("Account verified successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            Optional<Customer> opt = customerRepository.findByEmail(email);
            if (opt.isEmpty()) {
                return ResponseEntity.ok().build(); // Don't reveal if email exists
            }

            Customer user = opt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setTokenExpiration(LocalDateTime.now().plusHours(2));
            customerRepository.save(user);

            // Send email with reset link
            String resetLink = "http://localhost:3000/reset-password?token=" + token;
             emailService.sendPasswordReset(email, resetLink);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send reset email");
        }
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
        private String email;
        private boolean isAdmin;

        public LoginResponse(String token, String email, boolean isAdmin) {
            this.token = token;
            this.email = email;
            this.isAdmin = isAdmin;
        }

        public String getToken() {
            return token;
        }
        public String getEmail() {
            return email;
        }

        public boolean isAdmin() {
            return isAdmin;
        }
    }

    // -------------------------------
    // Helper: Decrypt and mask payment info
    // -------------------------------
    private void decryptAndMaskPaymentInfo(Customer customer) {
        if (customer.getPaymentInfo() != null) {
            customer.getPaymentInfo().forEach(p -> {
                try {
                    if (p.getCardNumber() != null)
                        p.setCardNumber(AESUtil.decrypt(p.getCardNumber()));
                    if (p.getCvv() != null)
                        p.setCvv(AESUtil.decrypt(p.getCvv()));

                    // Mask before sending
                    if (p.getCardNumber() != null && p.getCardNumber().length() > 4) {
                        String last4 = p.getCardNumber().substring(p.getCardNumber().length() - 4);
                        p.setCardNumber("**** **** **** " + last4);
                    }
                    if (p.getCvv() != null) p.setCvv("***");

                } catch (Exception e) {
                    // skip
                }
            });
        }
    }
}