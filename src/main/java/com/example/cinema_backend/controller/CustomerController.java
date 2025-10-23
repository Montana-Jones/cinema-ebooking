package com.example.cinema_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.cinema_backend.model.Customer;
import com.example.cinema_backend.repository.CustomerRepository;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    // ✅ Get all customers
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // ✅ Get customer by ID
    @GetMapping("/{id}")
    public Optional<Customer> getCustomerById(@PathVariable String id) {
        return customerRepository.findById(id);
    }

    // ✅ Get customer by email
    @GetMapping("/email/{email}")
    public Optional<Customer> getCustomerByEmail(@PathVariable String email) {
        return customerRepository.findByEmail(email);
    }

    // ✅ Create a new customer
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

    // ✅ Update customer
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable String id, @RequestBody Customer updatedCustomer) {
        return customerRepository.findById(id).map(customer -> {
            if (updatedCustomer.getFirstName() != null) {
                customer.setFirstName(updatedCustomer.getFirstName());
            }
            if (updatedCustomer.getLastName() != null) {
                customer.setLastName(updatedCustomer.getLastName());
            }
            if (updatedCustomer.getEmail() != null) {
                customer.setEmail(updatedCustomer.getEmail());
            }
            if (updatedCustomer.getStatus() != null) {
                customer.setStatus(updatedCustomer.getStatus());
            }
            if (updatedCustomer.getBookings() != null) {
                customer.setBookings(updatedCustomer.getBookings());
            }
            if (updatedCustomer.getPaymentInfo() != null) {
                customer.setPaymentInfo(updatedCustomer.getPaymentInfo());
            }
            return customerRepository.save(customer);
        }).orElse(null);
    }

    // ✅ Delete customer
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerRepository.deleteById(id);
    }
}
