package com.example.cinema_backend.config;

import com.example.cinema_backend.model.Movie;
import com.example.cinema_backend.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final MovieRepository movieRepository;

    public DataLoader(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public void run(String... args) {
        // Clear existing data
        movieRepository.deleteAll();

        // Sample movies
        movieRepository.save(new Movie(
                "The Avengers",
                "Action",
                "PG-13",
                "Earth's mightiest heroes must come together...",
                "https://link-to-poster.com/avengers.jpg",
                "https://link-to-trailer.com/avengers.mp4"
        ));

        movieRepository.save(new Movie(
                "Finding Nemo",
                "Animation",
                "G",
                "A clownfish searches for his missing son...",
                "https://link-to-poster.com/nemo.jpg",
                "https://link-to-trailer.com/nemo.mp4"
        ));

        movieRepository.save(new Movie(
                "Inception",
                "Sci-Fi",
                "PG-13",
                "A thief who steals corporate secrets through dream-sharing technology...",
                "https://link-to-poster.com/inception.jpg",
                "https://link-to-trailer.com/inception.mp4"
        ));
    }
}
