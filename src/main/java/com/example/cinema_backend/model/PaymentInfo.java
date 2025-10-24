package com.example.cinema_backend.model;


import lombok.Data;

@Data // Lombok's annotation for getters, setters, toString, etc.
public class PaymentInfo {

    
    private int cardNumber;
  
    private String expirationDate;

  
}