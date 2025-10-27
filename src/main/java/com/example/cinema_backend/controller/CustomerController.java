package com.example.cinema_backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.cinema_backend.model.Customer;
import com.example.cinema_backend.model.PaymentInfo;
import com.example.cinema_backend.repository.CustomerRepository;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

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
    @PostMapping
    public Customer addCustomer(@RequestBody Customer newCustomer) {
        newCustomer.setId(null);

        // Generate a simple verification code
        newCustomer.setVerificationCode(UUID.randomUUID().toString().substring(0, 6));
        newCustomer.setVerified(false);

        // Save customer
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
    // DTO for verification request
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
}
