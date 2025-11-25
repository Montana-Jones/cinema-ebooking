package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Data;

@Document(collection = "ticket")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class Ticket {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    private double ticketPrice;
    private TicketType ticketType;
    private int numTickets;


}