package com.example.cinema_backend.model;



import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payment_info")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class PaymentInfo {

    @Id
    private String id;
    private String cardHolder;
    private String cardNumber;
    private String expirationDate;
    private String cvv;

    @DBRef
    private User user;

}