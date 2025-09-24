package com.example.cinema_backend.controller;

import com.example.cinema_backend.model.Movie;
import com.example.cinema_backend.service.MovieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000") // allow Next.js frontend
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public Optional<Movie> getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String title) {
        return movieService.searchMovies(title);
    }

    @GetMapping("/filter")
    public List<Movie> filterByGenre(@RequestParam String genre) {
        return movieService.filterByGenre(genre);
    }
}
