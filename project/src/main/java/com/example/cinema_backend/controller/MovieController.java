package com.example.cinema_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cinema_backend.model.Movie;
import com.example.cinema_backend.service.MovieService;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // GET /api/v1/movies
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    // GET /api/v1/movies/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    
}
