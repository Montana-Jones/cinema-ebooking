package com.example.cinema_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.cinema_backend.model.Customer;
import com.example.cinema_backend.repository.CustomerRepository;
import com.example.cinema_backend.service.EmailService;
import com.example.cinema_backend.util.JwtUtil;

@RestController
@RequestMapping("/api/customers")
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
    public LoginResponse login(@RequestBody LoginRequest request) {
        Optional<Customer> opt = customerRepository.findByEmail(request.getEmail());
        if (opt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        Customer customer = opt.get();

        // For now, password is stored in plain text
        if (!customer.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(
                String.valueOf(customer.getId()),
                customer.getEmail());

        return new LoginResponse(token, customer);
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
