package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Data;

@Document(collection = "cinema")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class Cinema {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    @DBRef
    private Theatre theatre;
}