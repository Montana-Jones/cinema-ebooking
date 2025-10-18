package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "user")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class User {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    private String password;
    private String role; // Customer or Admin
}