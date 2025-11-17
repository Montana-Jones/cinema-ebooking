package com.example.cinema_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.cinema_backend.repository.ShowtimeRepository;
import com.example.cinema_backend.model.Showtime;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import com.example.cinema_backend.repository.ShowroomRepository;
import com.example.cinema_backend.model.Showroom;
import com.example.cinema_backend.repository.MovieRepository;
import com.example.cinema_backend.model.Movie;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private ShowroomRepository showroomRepository;

    @Autowired
    private MovieRepository movieRepository;

    // ------------------ GET ALL SHOWTIMES ------------------
    @GetMapping
    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    // ------------------ GET SHOWTIME BY ID ------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getShowtimeById(@PathVariable String id) {
        Optional<Showtime> opt = showtimeRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body("Showtime not found: " + id);
        }
        return ResponseEntity.ok(opt.get());
    }

    // ------------------ CREATE SHOWTIME ------------------
    @PostMapping
    public ResponseEntity<?> createShowtime(@RequestBody Showtime showtime) {
        try {
            // Validate Showroom
            Showroom showroom = showroomRepository.findByName(showtime.getRoomName())
                    .orElseThrow(() -> new RuntimeException("Showroom not found: " + showtime.getRoomName()));

            // Validate Movie
            Movie movie = movieRepository.findById(showtime.getMovieId())
                    .orElseThrow(() -> new RuntimeException("Movie not found: " + showtime.getMovieId()));

            // Set relations
            showtime.setShowroom(showroom);
            showtime.setMovie(movie);

            // Generate seat binary if missing
            if (showtime.getSeatBinary() == null || showtime.getSeatBinary().isEmpty()) {
                int totalSeats = showroom.getNumRows() * showroom.getNumCols();
                showtime.setSeatBinary("0".repeat(totalSeats));
            }

            // Save showtime
            Showtime savedShowtime = showtimeRepository.save(showtime);

            // Optionally, update movie/showroom relations
            movie.getShowtime().add(savedShowtime);
            movieRepository.save(movie);

            showroom.getShowtimes().add(savedShowtime);
            showroomRepository.save(showroom);

            return ResponseEntity.ok(savedShowtime);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving showtime: " + e.getMessage());
        }
    }

    // ------------------ DELETE SHOWTIME ------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShowtime(@PathVariable String id) {
        try {
            showtimeRepository.deleteById(id);
            return ResponseEntity.ok("Showtime deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting showtime: " + e.getMessage());
        }
    }

    // ------------------ UPDATE SEATS ------------------
    @PutMapping("/saveSeats/{id}")
    public ResponseEntity<?> updateSeats(@PathVariable String id, @RequestBody String seatBinary) {
        Optional<Showtime> opt = showtimeRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body("Showtime not found: " + id);
        }
        Showtime showtime = opt.get();
        showtime.setSeatBinary(seatBinary);
        showtimeRepository.save(showtime);
        return ResponseEntity.ok(showtime);
    }

}
