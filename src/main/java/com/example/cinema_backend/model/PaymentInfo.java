package com.example.cinema_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "payment_info")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class PaymentInfo {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    private int cardNumber;
    private String BillingAddress;
    private String expirationDate;
}