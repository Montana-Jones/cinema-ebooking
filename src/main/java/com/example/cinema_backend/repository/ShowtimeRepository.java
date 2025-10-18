package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.Showtime;

public interface ShowtimeRepository extends MongoRepository<Showtime, String> {

}