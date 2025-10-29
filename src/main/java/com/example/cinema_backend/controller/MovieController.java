package com.example.cinema_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.cinema_backend.model.Movie;
import com.example.cinema_backend.repository.MovieRepository;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")

public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    // -------------------------------
    // GET all movies
    // -------------------------------
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // -------------------------------
    // GET movie by ID
    // -------------------------------
    @GetMapping("/{id}")
    public Optional<Movie> getMovieById(@PathVariable String id) {
        return movieRepository.findById(id);
    }

    // -------------------------------
    // CREATE a new movie
    // -------------------------------
    @PostMapping
    public Movie addMovie(@RequestBody Movie newMovie) {
        newMovie.setId(null);
        return movieRepository.save(newMovie);
    }

    // -------------------------------
    // UPDATE movie by ID
    // -------------------------------
    @PutMapping("/{id}")
    public Movie updateMovie(@PathVariable String id, @RequestBody Movie updatedMovie) {
        Optional<Movie> opt = movieRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("Movie not found with id: " + id);
        }

        Movie movie = opt.get();
        boolean hasChanges = false;

        if (updatedMovie.getTitle() != null && !updatedMovie.getTitle().equals(movie.getTitle())) {
            movie.setTitle(updatedMovie.getTitle());
            hasChanges = true;
        }

        if (updatedMovie.getGenre() != null && !updatedMovie.getGenre().equals(movie.getGenre())) {
            movie.setGenre(updatedMovie.getGenre());
            hasChanges = true;
        }

        if (updatedMovie.getMpaaRating() != null && !updatedMovie.getMpaaRating().equals(movie.getMpaaRating())) {
            movie.setMpaaRating(updatedMovie.getMpaaRating());
            hasChanges = true;
        }

        if (updatedMovie.getDirector() != null && !updatedMovie.getDirector().equals(movie.getDirector())) {
            movie.setDirector(updatedMovie.getDirector());
            hasChanges = true;
        }

        if (updatedMovie.getProducer() != null && !updatedMovie.getProducer().equals(movie.getProducer())) {
            movie.setProducer(updatedMovie.getProducer());
            hasChanges = true;
        }

        if (updatedMovie.getCast() != null && !updatedMovie.getCast().equals(movie.getCast())) {
            movie.setCast(updatedMovie.getCast());
            hasChanges = true;
        }

        if (updatedMovie.getSynopsis() != null && !updatedMovie.getSynopsis().equals(movie.getSynopsis())) {
            movie.setSynopsis(updatedMovie.getSynopsis());
            hasChanges = true;
        }

        if (updatedMovie.getPosterUrl() != null && !updatedMovie.getPosterUrl().equals(movie.getPosterUrl())) {
            movie.setPosterUrl(updatedMovie.getPosterUrl());
            hasChanges = true;
        }

        if (updatedMovie.getTrailerUrl() != null && !updatedMovie.getTrailerUrl().equals(movie.getTrailerUrl())) {
            movie.setTrailerUrl(updatedMovie.getTrailerUrl());
            hasChanges = true;
        }

        if (updatedMovie.isNowShowing() != movie.isNowShowing()) {
            movie.setNowShowing(updatedMovie.isNowShowing());
            hasChanges = true;
        }

        if (updatedMovie.isComingSoon() != movie.isComingSoon()) {
            movie.setComingSoon(updatedMovie.isComingSoon());
            hasChanges = true;
        }

        if (updatedMovie.getRating() != movie.getRating()) {
            movie.setRating(updatedMovie.getRating());
            hasChanges = true;
        }

        if (!hasChanges) {
            return movie; // No updates → return current movie
        }

        return movieRepository.save(movie);
    }

    // -------------------------------
    // DELETE movie by ID
    // -------------------------------
    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable String id) {
        movieRepository.deleteById(id);
    }
}
