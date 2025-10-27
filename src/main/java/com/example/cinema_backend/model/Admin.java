package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "admins")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class Admin {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    private String email;
    private String password;
  
}