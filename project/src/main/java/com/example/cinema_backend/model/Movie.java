package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@Document(collection = "movies")
public class Movie {

    @Id
    @Field("_id")
    @JsonProperty("_id")
    private String id;

    private String title;
    private String genre;

    @Field("mpaa_rating")
    @JsonProperty("mpaa_rating")
    private String mpaaRating;

    private String director;
    private String producer;
    private String cast;

    @Field("synopsis")
    @JsonProperty("synopsis")
    private String synopsis;

    @Field("description")
    @JsonProperty("description")
    private String description;

    @Field("poster_url")
    @JsonProperty("poster_url")
    private String posterUrl;

    @Field("trailer_url")
    @JsonProperty("trailer_url")
    private String trailerUrl;

    @Field("release_date")
    @JsonProperty("release_date")
    private String releaseDate;

    @Field("now_showing")
    @JsonProperty("now_showing")
    private boolean nowShowing;

    @Field("coming_soon")
    @JsonProperty("coming_soon")
    private boolean comingSoon;

    private List<String> showtimes;
    private double rating;

    // Default constructor
    public Movie() {}

    // Full constructor
    public Movie(String id, String title, String genre, String mpaaRating, String director,
                 String producer, String cast, String synopsis, String description,
                 String posterUrl, String trailerUrl, String releaseDate,
                 boolean nowShowing, boolean comingSoon, List<String> showtimes, double rating) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.mpaaRating = mpaaRating;
        this.director = director;
        this.producer = producer;
        this.cast = cast;
        this.synopsis = synopsis;
        this.description = description;
        this.posterUrl = posterUrl;
        this.trailerUrl = trailerUrl;
        this.releaseDate = releaseDate;
        this.nowShowing = nowShowing;
        this.comingSoon = comingSoon;
        this.showtimes = showtimes;
        this.rating = rating;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getMpaaRating() { return mpaaRating; }
    public void setMpaaRating(String mpaaRating) { this.mpaaRating = mpaaRating; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getProducer() { return producer; }
    public void setProducer(String producer) { this.producer = producer; }

    public String getCast() { return cast; }
    public void setCast(String cast) { this.cast = cast; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public boolean isNowShowing() { return nowShowing; }
    public void setNowShowing(boolean nowShowing) { this.nowShowing = nowShowing; }

    public boolean isComingSoon() { return comingSoon; }
    public void setComingSoon(boolean comingSoon) { this.comingSoon = comingSoon; }

    public List<String> getShowtimes() { return showtimes; }
    public void setShowtimes(List<String> showtimes) { this.showtimes = showtimes; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
}
