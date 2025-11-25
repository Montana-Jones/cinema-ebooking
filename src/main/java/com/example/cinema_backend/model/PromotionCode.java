package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
// import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.mongodb.core.mapping.Document;
// import org.springframework.data.mongodb.core.mapping.Field;

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
    private String expiry_date;

    public String getexpiry_date() {
        return expiry_date;
    }

    public void setexpiry_date(String expiry_date) {
        this.expiry_date = expiry_date;
    }
}