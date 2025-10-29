package com.example.cinema_backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;




import lombok.Data;

@Document(collection = "customer")
@Data // Lombok's annotation for getters, setters, toString, etc.
public class Customer {

    @Id
    private String id; // MongoDB will auto-generate this and it maps to the '_id' field

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role; // "CUSTOMER" or "ADMIN"

    private Status status;
    private Promotion promotion;
    private String phoneNumber;
    private String homeAddress;
    private String billingAddress;

    private List<Booking> bookings;
    private List<PaymentInfo> paymentInfo;

    private String verificationCode;
    private boolean verified;

    private String resetToken;
    private LocalDateTime tokenExpiration;

    public boolean isAdmin() {
            return "ADMIN".equalsIgnoreCase(role);
    }
    
}