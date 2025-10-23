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

    //  Get all customers
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    @GetMapping("/{id}")
    public Optional<Customer> getCustomerById(@PathVariable String id) {
        return customerRepository.findById(id);
    }

    //  Get customer by email
    @GetMapping("/email/{email}")
    public Optional<Customer> getCustomerByEmail(@PathVariable String email) {
        return customerRepository.findByEmail(email);
    }

    //  Create a new customer
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

    @PutMapping("/email/{email}")
    public Customer updateCustomerByEmail(@PathVariable String email, @RequestBody Customer updatedCustomer) {
        Optional<Customer> opt = customerRepository.findByEmail(email);
        if (opt.isEmpty()) return null;
        Customer customer = opt.get();

        if (updatedCustomer.getFirstName() != null) customer.setFirstName(updatedCustomer.getFirstName());
        if (updatedCustomer.getLastName() != null) customer.setLastName(updatedCustomer.getLastName());
        if (updatedCustomer.getStatus() != null) customer.setStatus(updatedCustomer.getStatus());
        
        if (updatedCustomer.getBookings() != null) {
            customer.setBookings(
                updatedCustomer.getBookings().stream()
                    .filter(b -> b.getId() != null) // keep only bookings that have a valid ID
                    .toList()
            );
        }

        if (updatedCustomer.getPaymentInfo() != null) customer.setPaymentInfo(updatedCustomer.getPaymentInfo());

        return customerRepository.save(customer);
    }


    //  Delete customer
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerRepository.deleteById(id);
    }
}
