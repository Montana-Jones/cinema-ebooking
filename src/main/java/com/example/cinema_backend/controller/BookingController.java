package com.example.cinema_backend.controller;
 
import com.example.cinema_backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.*;
import com.example.cinema_backend.model.Booking;
import com.example.cinema_backend.service.EmailService;
import com.example.cinema_backend.model.SendBookingRequest;


@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private EmailService emailService;

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

    // -------------------------------
    // SEND booking confirmation email
    // -------------------------------
    @PostMapping("/send")
    public void sendBookingConfirmationEmail(@RequestBody String request) {

        Optional<Booking> b = bookingRepository.findByBookingNum(request);

        if (b.isEmpty()) {
            throw new RuntimeException("Booking not found for number: " + request);
        }

        Booking booking = b.get(); 

        StringBuilder sb = new StringBuilder();
        sb.append("Hello ").append(booking.getEmail()).append(",\n\n");
        sb.append("Thank you for your booking at our cinema! Here are your booking details:\n");
        sb.append("Booking Number: ").append(booking.getBookingNum()).append("\n");
        sb.append("Movie: ").append(booking.getMovieTitle()).append("\n");
        sb.append("Showtime: ").append(booking.getDate()).append(" at ").append(booking.getStartTime()).append("\n");
        sb.append("Room: ").append(booking.getRoomName()).append("\n");

        if (booking.getSeats() != null) {
            sb.append("Seats: ")
                .append(
                    booking.getSeats().stream()
                        .map(seat -> seat.getId() + " (" + seat.getType() + ")")
                        .collect(Collectors.joining(", "))
                )
                .append("\n");
        }

        sb.append("Subtotal Price: $").append(booking.getSubtotalPrice()).append("\n");
        sb.append("Discount: $").append(booking.getDiscount()).append("\n");
        sb.append("Tax Rate: ").append(booking.getTaxRate()).append("%\n");
        sb.append("Booking Fee: $").append(booking.getBookingFee()).append("\n");
        sb.append("Total Price: $").append(booking.getTotalPrice()).append("\n\n");
        sb.append("We look forward to seeing you at the cinema!\n");
        sb.append("Cinema Team");

        emailService.sendEmail(
            booking.getEmail(),
            "Movie Booking Confirmation",
            sb.toString()
        );
    }

    
}
