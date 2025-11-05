package com.example.cinema_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.cinema_backend.repository.ShowtimeRepository;
import com.example.cinema_backend.model.Showtime;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;




@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editShowtime(@PathVariable String id, @RequestBody Showtime updatedShowtime) {
       
        Optional<Showtime> opt = showtimeRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body("Showtime not found: " + id);
        }
        Showtime showtime = opt.get();
        if (updatedShowtime.getMovie() != null) {
        
            showtime.setMovie(updatedShowtime.getMovie());
        }
        if (updatedShowtime.getStartTime() != null) {
            showtime.setStartTime(updatedShowtime.getStartTime());
        }
        if (updatedShowtime.getEndTime() != null) {
            showtime.setEndTime(updatedShowtime.getEndTime());
        }
        
        showtimeRepository.save(showtime);
        return ResponseEntity.ok(showtime);

    }
    @PostMapping("/add")
    public ResponseEntity<?> addShowtime(@RequestBody Showtime newShowtime) {
        Showtime savedShowtime = showtimeRepository.save(newShowtime);
        return ResponseEntity.ok(savedShowtime);
    }
    


}
