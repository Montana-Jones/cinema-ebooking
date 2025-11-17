package com.example.cinema_backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Data;

@Document(collection = "user")
@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class User {

    @Id
    private String id;

    @JsonProperty("firstname")
    private String firstName;

    @JsonProperty("lastname")
    private String lastName;

    private String email;
    private String password;

    private String role; // ADMIN or CUSTOMER

    private Status status;
    private Promotion promotion;

    @JsonProperty("phonenumber")
    private String phoneNumber;

    @JsonProperty("homeaddress")
    private String homeAddress;

    @JsonProperty("billingaddress")
    private String billingAddress;

    // private String Promotions;

    @DBRef
    private List<Booking> bookings;
    @DBRef
    @JsonProperty("payment_info")
    private List<PaymentInfo> paymentInfo;

    private String verificationCode;
    private boolean verified;

    private String resetToken;
    private LocalDateTime tokenExpiration;

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(role);
    }
}
