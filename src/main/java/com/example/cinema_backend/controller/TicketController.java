package com.example.cinema_backend.controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.cinema_backend.repository.TicketRepository;
import com.example.cinema_backend.model.Showtime;
import com.example.cinema_backend.model.Ticket;

import java.util.List;
import java.util.Optional;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping
     public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @GetMapping("/{type}")
    public Ticket getTicketByType(@PathVariable String type) {
        return ticketRepository.findByTicketType(type);
    }



    
}
