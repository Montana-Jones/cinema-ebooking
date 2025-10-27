package com.example.cinema_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.cinema_backend.model.Movie;
import com.example.cinema_backend.repository.MovieRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(String id) {
        return movieRepository.findById(id).orElse(null);
    }

    public List<Movie> getNowShowingMovies() {
        return movieRepository.findByNowShowing(true);
    }

    public List<Movie> getComingSoonMovies() {
        return movieRepository.findByNowShowing(false);
    }

    public List<Movie> searchMoviesByTitle(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Movie> filterMoviesByGenre(String genre) {
        return movieRepository.findByGenreContainingIgnoreCase(genre);
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public boolean deleteMovie(String id) {
        if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
