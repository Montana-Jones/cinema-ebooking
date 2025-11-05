package com.example.cinema_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
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




@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    @Autowired
    private ShowtimeRepository showtimeRepository;
    @Autowired
    private ShowroomRepository showroomRepository;

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

    @GetMapping("/{roomName}")
    public List<Showtime> getShowtimeByRoomName(@PathVariable String roomName) {
        return showtimeRepository.findByRoomName(roomName);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addShowtime(@RequestBody Showtime newShowtime) {
        Showroom showroom = showroomRepository.findByName(newShowtime.getRoomName())
                .orElseThrow(() -> new RuntimeException("Showroom not found: " + newShowtime.getRoomName()));
        newShowtime.setShowroom(showroom);
        Showtime savedShowtime = showtimeRepository.save(newShowtime);
        showroom.getShowtimes().add(savedShowtime);
        showroomRepository.save(showroom);
        return ResponseEntity.ok(savedShowtime);
    }
    


}
