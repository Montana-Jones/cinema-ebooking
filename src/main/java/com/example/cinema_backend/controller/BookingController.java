package com.example.cinema_backend.controller;
 
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.cinema_backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;  
import org.springframework.web.bind.annotation.*;
import com.example.cinema_backend.model.Booking;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // -------------------------------
    // GET all bookings
    // -------------------------------
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // -------------------------------
    // GET booking by ID
    // -------------------------------
    @GetMapping("/email/{email}")
    public List<Booking> getBookingById(@PathVariable String email) {
        return bookingRepository.findByEmail(email);
    }

    @GetMapping("/number/{bookingNum}")
    public Optional<Booking> getBookingByBookingNum(@PathVariable String bookingNum) {
        return bookingRepository.findByBookingNum(bookingNum);
    }

    // -------------------------------
    // CREATE a new booking
    // -------------------------------
    @PostMapping("/add")
    public Booking addBooking(@RequestBody Booking newBooking) {
        newBooking.setId(null);
        return bookingRepository.save(newBooking);
    }
    
}
