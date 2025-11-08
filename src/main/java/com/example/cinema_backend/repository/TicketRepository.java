package com.example.cinema_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    Ticket findByTicketType(String type);
}