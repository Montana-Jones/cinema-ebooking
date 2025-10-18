package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.Cinema;

public interface CinemaRepository extends MongoRepository<Cinema, String> {

}