package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Creates getters, setters, toString, etc. automatically
@NoArgsConstructor // Creates a no-argument constructor
@AllArgsConstructor // Creates a constructor with all arguments
@Document(collection = "showtime")
public class Showtime {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    private String time; // e.g., "2:00 PM"
    private String date;
    private String duration;

    @DBRef
    private Movie movie;
    
    @DBRef
    private Showroom showroom;
}