package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.cinema_backend.model.Customer;
import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, String> {
    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByResetToken(String resetToken);
}
