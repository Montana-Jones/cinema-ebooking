package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.cinema_backend.model.Admin;
import java.util.Optional;

public interface AdminRepository extends MongoRepository<Admin, String> {
    Optional<Admin> findByUsername(String username);
}
