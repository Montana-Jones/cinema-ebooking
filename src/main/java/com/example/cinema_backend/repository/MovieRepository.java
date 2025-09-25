package com.example.cinema_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.Movie;

public interface MovieRepository extends MongoRepository<Movie, String> {

    // Finds movies where the nowShowing property is true or false
    List<Movie> findByNowShowing(boolean nowShowing);

    // Finds movies where the title contains the given search string (case-insensitive)
    List<Movie> findByTitleContainingIgnoreCase(String title);

    // Finds movies where the genre string contains the given genre (case-insensitive)
    List<Movie> findByGenreContainingIgnoreCase(String genre);

    // Finds a single movie by its exact title (example of a more specific query)
    Optional<Movie> findByTitle(String title);
}