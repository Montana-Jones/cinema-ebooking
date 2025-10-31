package com.example.cinema_backend.model;



import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;


@Data // Lombok's annotation for getters, setters, toString, etc.
public class PaymentInfo {

    
    private String cardHolder;
    private String cardNumber;
    private String expirationDate;
    private String cvv;

    @DBRef
    private User user;

}