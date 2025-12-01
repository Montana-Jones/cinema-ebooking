package com.example.cinema_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.Booking;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByEmail(String email);

    Optional<Booking> findByBookingNum(String bookingNum);
}