package com.example.cinema_backend;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "movies")
@Getter
@Setter
@NoArgsConstructor
public class Movie {

    @Id
    private String id;

    private String title;
    private String genre;
    private String mpaaRating;
    private String director;
    private String producer;
    private String cast;
    private String synopsis;
    private String posterUrl;
    private String trailerUrl;
    private boolean nowShowing;
    private boolean comingSoon;
    private double rating;
}