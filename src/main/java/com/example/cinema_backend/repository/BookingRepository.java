package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.Booking;

public interface BookingRepository extends MongoRepository<Booking, String> {

}