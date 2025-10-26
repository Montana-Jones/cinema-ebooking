package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.cinema_backend.model.Admin;
public interface AdminRepository extends MongoRepository<Admin, String> {
    
    java.util.Optional<Admin> findByEmail(String email);
}


