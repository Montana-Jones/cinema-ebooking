package com.example.cinema_backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.cinema_backend.model.Customer;
import com.example.cinema_backend.model.Booking;
import com.example.cinema_backend.model.PaymentInfo;
import com.example.cinema_backend.repository.CustomerRepository;
import com.example.cinema_backend.repository.BookingRepository;


@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
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
    // GET customer by email
    // -------------------------------
    @GetMapping("/email/{email}")
    public Optional<Customer> getCustomerByEmail(@PathVariable String email) {
        return customerRepository.findByEmail(email);
    }

    // -------------------------------
    // CREATE a new customer
    // -------------------------------
    // @PostMapping
    // public Customer createCustomer(@RequestBody Customer customer) {
    //     // Ensure any nested objects have valid IDs
    //     if (customer.getBookings() != null) {
    //         customer.getBookings().forEach(b -> {
    //             if (b.getId() == null || b.getId().isEmpty()) {
    //                 b.setId(UUID.randomUUID().toString());
    //             }
    //             bookingRepository.save(b);
    //         });
    //     }

    //     if (customer.getPaymentInfo() != null) {
    //         customer.getPaymentInfo().forEach(p -> {
    //             if (p.getId() == null || p.getId().isEmpty()) {
    //                 p.setId(UUID.randomUUID().toString());
    //             }
    //             paymentInfoRepository.save(p);
    //         });
    //     }

    //     return customerRepository.save(customer);
    // }

    // -------------------------------
    // UPDATE customer by email
    // -------------------------------
    @PutMapping("/email/{email}")
    public Customer updateCustomerByEmail(@PathVariable String email, @RequestBody Customer updatedCustomer) {
        Optional<Customer> opt = customerRepository.findByEmail(email);
        if (opt.isEmpty()) return null;
            Customer customer = opt.get();

        if (updatedCustomer.getFirstName() != null) customer.setFirstName(updatedCustomer.getFirstName());
        if (updatedCustomer.getLastName() != null) customer.setLastName(updatedCustomer.getLastName());
      
        if (updatedCustomer.getPromotion() != null) customer.setPromotion(updatedCustomer.getPromotion());
        if (updatedCustomer.getBillingAddress() != null) customer.setBillingAddress(updatedCustomer.getBillingAddress());

        

        


        return customerRepository.save(customer);
    }

    // -------------------------------
    // DELETE customer by ID
    // -------------------------------
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerRepository.deleteById(id);
    }
}