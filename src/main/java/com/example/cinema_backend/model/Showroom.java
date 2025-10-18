package com.example.cinema_backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Data;

@Document(collection = "showroom")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class Showroom {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    private int numSeats;

    @DBRef
    private List<Showtime> showtimes;

    @DBRef
    private Theatre theatre;
}