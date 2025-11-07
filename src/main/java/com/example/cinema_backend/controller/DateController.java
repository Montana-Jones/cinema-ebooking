package com.example.cinema_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.cinema_backend.repository.DateRepository;
import com.example.cinema_backend.model.Date;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/dates")
public class DateController {
    
    @Autowired
    private DateRepository dateRepository;

    @RequestMapping("{date}")
    public Date getDateByDate(@org.springframework.web.bind.annotation.PathVariable String date) {
        return dateRepository.findByDate(date); 
    }

    @GetMapping
    public java.util.List<Date> getAllDates() {
        return dateRepository.findAll();    
    }

}
