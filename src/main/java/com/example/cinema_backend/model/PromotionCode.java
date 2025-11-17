package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

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
    @JsonProperty("expiryDate")
    @Field("expiryDate")
    private String expiryDate;

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

}
