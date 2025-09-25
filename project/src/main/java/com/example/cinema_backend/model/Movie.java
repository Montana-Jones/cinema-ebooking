package com.example.cinema_backend.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "movies")
public class Movie {
    @Id
    private String id;
    private String title;
    private String genre;
    private String description;
    private String releaseDate;
    private boolean nowShowing;

    // Constructors, getters, and setters

    public Movie() {
    }

    public Movie(String id, String title, String genre, String description, String releaseDate, boolean nowShowing) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.description = description;
        this.releaseDate = releaseDate;
        this.nowShowing = nowShowing;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public boolean isNowShowing() {
        return nowShowing;
    }

    public void setNowShowing(boolean nowShowing) {
        this.nowShowing = nowShowing;
    }
}
