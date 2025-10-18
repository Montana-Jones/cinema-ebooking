package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.Theatre;

public interface TheatreRepository extends MongoRepository<Theatre, String> {

} 