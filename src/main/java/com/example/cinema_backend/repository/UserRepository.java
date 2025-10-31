package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.User;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
}