package com.example.cinema_backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Data;

@Document(collection = "user")
@Data
public class User {

    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role; // ADMIN or CUSTOMER

    private Status status;
    private Promotion promotion;
    private String phoneNumber;
    private String homeAddress;
    private String billingAddress;

    private boolean Promotions;

    @DBRef
    private List<Booking> bookings;
    @DBRef
    private List<PaymentInfo> paymentInfo;

    private String verificationCode;
    private boolean verified;

    private String resetToken;
    private LocalDateTime tokenExpiration;

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(role);
    }
}
