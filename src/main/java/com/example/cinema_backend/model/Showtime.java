package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "showtime")
public class Showtime {

    @Id
    private String id;

    private String startTime;
    private String endTime;
    private String date;
    private String duration;
    private String movieId;
    private String roomName;
    private String seatBinary;

    // Ignore these during JSON serialization to prevent infinite recursion
    @DBRef
    @JsonIgnore
    private Movie movie;

    @DBRef
    @JsonIgnore
    private Showroom showroom;
}