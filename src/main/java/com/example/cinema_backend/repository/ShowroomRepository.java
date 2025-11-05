package com.example.cinema_backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.Showroom;

public interface ShowroomRepository extends MongoRepository<Showroom, String> {

    Optional<Showroom> findByName(String name);

}