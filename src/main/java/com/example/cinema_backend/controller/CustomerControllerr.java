package com.example.cinema_backend.controller;

import java.util.List;
import java.util.Optional;
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

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerControllerr {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
        return ResponseEntity.ok(customer);
    }

    // -------------------------------
    // ADD new customer
    // -------------------------------
    @PostMapping("/add")
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

            if (newCustomer.getStatus() == null) newCustomer.setStatus(Status.ACTIVE);

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
