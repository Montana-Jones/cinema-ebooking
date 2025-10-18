package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.User;

public interface UserRepository extends MongoRepository<User, String> {

}