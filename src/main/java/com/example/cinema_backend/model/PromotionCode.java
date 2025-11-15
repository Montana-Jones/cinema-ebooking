package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "promotion")
@Data
public class PromotionCode {
    @Id
    private String id;
    private String code;
    private double amount;
    private String name;
    private String state;

}
