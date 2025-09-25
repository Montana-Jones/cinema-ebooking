package com.example.cinema_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cinema_backend.exception.MovieNotFoundException;
import com.example.cinema_backend.model.Movie;
import com.example.cinema_backend.repository.MovieRepository;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(String id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + id));
    }

    // For Home Page: Get "Currently Running" movies
    public List<Movie> getNowShowingMovies() {
        return movieRepository.findByNowShowing(true);
    }

    // For Home Page: Get "Coming Soon" movies
    public List<Movie> getComingSoonMovies() {
        return movieRepository.findByNowShowing(false);
    }

    // For Search feature
    public List<Movie> searchMoviesByTitle(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    // For Filter feature
    public List<Movie> filterMoviesByGenre(String genre) {
        return movieRepository.findByGenreContainingIgnoreCase(genre);
    }
}
