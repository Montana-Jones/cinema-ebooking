package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;  
import lombok.Data;

@Data
@Document(collection = "date")
public class Date {

    @Id
    private String id;
    private String date; // e.g., "2023-10-15"
    
}
