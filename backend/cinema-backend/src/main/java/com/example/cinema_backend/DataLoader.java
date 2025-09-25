package com.example.cinema_backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final MovieRepository movieRepository;

    public DataLoader(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public void run(String... args) {
        if (movieRepository.count() == 0) {
            Movie m1 = new Movie();
            m1.setId("0000000001");
            m1.setTitle("Forrest Gump");
            m1.setGenre("Comedy, Romance");
            m1.setMpaaRating("PG-13");
            m1.setDirector("Robert Zemeckis");
            m1.setProducer("Wendy Finerman, Steve Tisch, Steve Starkey");
            m1.setCast("Tom Hanks, Robin Wright, Gary Sinise, Mykelti Williamson, Sally Field");
            m1.setSynopsis("A kind-hearted man with a low IQ who unintentionally influences history...");
            m1.setPosterUrl("https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTNI2SBzYW95C8Wo7zYV3bzVzem58xPnUzsZGLsnLg17mSMgR574acQZpgNK7a5XeF3THjqgQ");
            m1.setTrailerUrl("https://www.youtube.com/watch?v=bLvqoHBptjg");
            m1.setNowShowing(true);
            m1.setComingSoon(false);
            m1.setRating(4.9);

            // You can add more movies here
            // Movie m2 = new Movie();
            // ...

            movieRepository.saveAll(List.of(m1));
        }
    }
}