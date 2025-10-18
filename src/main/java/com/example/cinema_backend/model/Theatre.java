package com.example.cinema_backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Data;

@Document(collection = "theatre")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class Theatre {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    @DBRef
    private List<Showroom> showrooms;

    @DBRef
    private Cinema cinema;
}