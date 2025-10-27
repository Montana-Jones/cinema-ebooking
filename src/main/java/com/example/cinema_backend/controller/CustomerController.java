package com.example.cinema_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.cinema_backend.model.Customer;
import com.example.cinema_backend.repository.CustomerRepository;
import com.example.cinema_backend.service.EmailService;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmailService emailService;

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
    // UPDATE customer by email
    // -------------------------------
    @PutMapping("/email/{email}")
    public Customer updateCustomerByEmail(@PathVariable String email, @RequestBody Customer updatedCustomer) {
        Optional<Customer> opt = customerRepository.findByEmail(email);
        if (opt.isEmpty()) {
            throw new RuntimeException("Customer not found with email: " + email);
        }

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

        if (updatedCustomer.getPassword() != null && !updatedCustomer.getPassword().equals(customer.getPassword())) {
            customer.setPassword(updatedCustomer.getPassword());
            changeSummary.append("- Password changed\n");
            hasChanges = true;
        }

        if (updatedCustomer.getPhoneNumber() != null
                && !updatedCustomer.getPhoneNumber().equals(customer.getPhoneNumber())) {
            customer.setPhoneNumber(updatedCustomer.getPhoneNumber());
            changeSummary.append("- Phone number updated\n");
            hasChanges = true;
        }

        if (updatedCustomer.getHomeAddress() != null
                && !updatedCustomer.getHomeAddress().equals(customer.getHomeAddress())) {
            customer.setHomeAddress(updatedCustomer.getHomeAddress());
            changeSummary.append("- Home address updated\n");
            hasChanges = true;
        }

        if (updatedCustomer.getBillingAddress() != null
                && !updatedCustomer.getBillingAddress().equals(customer.getBillingAddress())) {
            customer.setBillingAddress(updatedCustomer.getBillingAddress());
            changeSummary.append("- Billing address updated\n");
            hasChanges = true;
        }

        if (updatedCustomer.getPromotion() != null && !updatedCustomer.getPromotion().equals(customer.getPromotion())) {
            customer.setPromotion(updatedCustomer.getPromotion());
            changeSummary.append("- Promotion preference updated\n");
            hasChanges = true;
        }

        if (updatedCustomer.getPaymentInfo() != null
                && !updatedCustomer.getPaymentInfo().equals(customer.getPaymentInfo())) {
            customer.setPaymentInfo(updatedCustomer.getPaymentInfo());
            changeSummary.append("- Payment methods updated\n");
            hasChanges = true;
        }

        if (!hasChanges) {
            return customer; // No updates → no email sent
        }

        Customer saved = customerRepository.save(customer);

        // Send summary email
        try {
            changeSummary.append("\nIf you didn’t make these changes, please contact support immediately.\n\n");
            changeSummary.append("Best regards,\nCinema Team");
            emailService.sendEmail(
                    customer.getEmail(),
                    "Account Update Notification",
                    changeSummary.toString());
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }

        return saved;
    }

    // -------------------------------
    // DELETE customer by ID
    // -------------------------------
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerRepository.deleteById(id);
    }
}
