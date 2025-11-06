package com.example.cinema_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.cinema_backend.repository.ShowroomRepository;
import com.example.cinema_backend.model.Showroom;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/showrooms")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowroomController {
    
    @Autowired
    private ShowroomRepository showroomRepository;

    @GetMapping
    public List<Showroom> getAllShowrooms() {
        return showroomRepository.findAll();
    }

    @GetMapping("/roomname/{name}")
    public Optional<Showroom> getShowroomByName(@PathVariable String name) {
        return showroomRepository.findByName(name);
    }
    

    @GetMapping("/{id}")
    public Optional<Showroom> getShowroomById(@PathVariable String id) {
        return showroomRepository.findById(id);
    }




}
