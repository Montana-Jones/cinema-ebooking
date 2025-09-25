package com.example.cinema_backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "movies")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class Movie {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    private String title;
    private String genre; // Kept as a String to match your frontend data
    private String mpaaRating;
    private String director;
    private String producer;
    private String cast; // Kept as a String to match your frontend data
    private String synopsis;
    private String posterUrl;
    private String trailerUrl;
    private boolean nowShowing;
    private boolean comingSoon;
    private List<Showtime> showtimes; // Added to match the frontend data structure
    private double rating;
}