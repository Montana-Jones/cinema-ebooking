package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Creates getters, setters, toString, etc. automatically
@NoArgsConstructor // Creates a no-argument constructor
@AllArgsConstructor // Creates a constructor with all arguments
@Document(collection = "showtime")
@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Showtime {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    @JsonProperty("startTime")
    private String startTime;

    @JsonProperty("endTime")
    private String endTime;

    private String date;
    private String duration;

    @JsonProperty("movieId")
    private String movieId;
    @JsonProperty("roomName")
    private String roomName;
    private String seatBinary;
    @DBRef
    private Movie movie;

    @DBRef
    private Showroom showroom;

}