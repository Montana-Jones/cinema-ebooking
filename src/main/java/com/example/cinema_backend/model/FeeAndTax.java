package com.example.cinema_backend.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.Data;
@Data
@Document(collection = "fee_and_tax")   
public class FeeAndTax {
    
    @Id
    private String id;
    private double bookingFee; // e.g., 1.50
    private double taxRate;    // e.g., 0.07 for 7%
}
