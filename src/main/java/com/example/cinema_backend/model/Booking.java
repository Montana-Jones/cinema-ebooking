package com.example.cinema_backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonBackReference;

import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Data;

@Document(collection = "booking")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class Booking {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    private int numTickets;
    private String showTime;

    


    @DBRef
    private List<Ticket> tickets;

    @DBRef
    private Customer customer;

   
}