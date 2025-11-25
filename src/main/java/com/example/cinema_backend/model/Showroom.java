package com.example.cinema_backend.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Data;

@Document(collection = "showroom")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class Showroom {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field
    private String name;
    private int numRows;
    private int numCols;

    @DBRef
    @JsonIgnore
    private List<Showtime> showtimes = new ArrayList<>();

}