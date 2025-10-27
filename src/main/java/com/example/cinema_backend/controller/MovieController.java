package com.example.cinema_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.cinema_backend.model.Movie;
import com.example.cinema_backend.service.MovieService;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // GET /api/movies
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    // GET /api/movies/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    // GET /api/movies/now-showing
    @GetMapping("/now-showing")
    public ResponseEntity<List<Movie>> getNowShowingMovies() {
        return ResponseEntity.ok(movieService.getNowShowingMovies());
    }

    // GET /api/movies/coming-soon
    @GetMapping("/coming-soon")
    public ResponseEntity<List<Movie>> getComingSoonMovies() {
        return ResponseEntity.ok(movieService.getComingSoonMovies());
    }

    // GET /api/movies/search?title=some_title
    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMoviesByTitle(@RequestParam String title) {
        return ResponseEntity.ok(movieService.searchMoviesByTitle(title));
    }

    // GET /api/movies/filter?genre=some_genre
    @GetMapping("/filter")
    public ResponseEntity<List<Movie>> filterMoviesByGenre(@RequestParam String genre) {
        return ResponseEntity.ok(movieService.filterMoviesByGenre(genre));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable String id, @RequestBody Movie updatedMovie) {
        Movie movie = movieService.getMovieById(id); // fetch existing movie
        if (movie == null) {
            return ResponseEntity.notFound().build();
        }

        // Update fields
        movie.setTitle(updatedMovie.getTitle());
        movie.setGenre(updatedMovie.getGenre());
        movie.setMpaaRating(updatedMovie.getMpaaRating());
        movie.setRating(updatedMovie.getRating());
        movie.setDirector(updatedMovie.getDirector());
        movie.setProducer(updatedMovie.getProducer());
        movie.setCast(updatedMovie.getCast());
        movie.setSynopsis(updatedMovie.getSynopsis());
        movie.setPosterUrl(updatedMovie.getPosterUrl());
        movie.setTrailerUrl(updatedMovie.getTrailerUrl());
        movie.setNowShowing(updatedMovie.isNowShowing());
        movie.setComingSoon(updatedMovie.isComingSoon());

        Movie savedMovie = movieService.saveMovie(movie); // make sure your service has a save/update method
        return ResponseEntity.ok(savedMovie);
    }

    // DELETE /api/movies/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable String id) {
        boolean deleted = movieService.deleteMovie(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}