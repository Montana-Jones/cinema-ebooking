package com.example.cinema_backend.model;



import lombok.Data;


@Data // Lombok's annotation for getters, setters, toString, etc.
public class PaymentInfo {

    
    private String cardHolder;
    private String cardNumber;
    private String expirationDate;
    private String cvv;


}