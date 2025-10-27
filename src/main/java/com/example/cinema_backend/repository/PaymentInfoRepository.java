package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.PaymentInfo;

public interface PaymentInfoRepository extends MongoRepository<PaymentInfo, String> {

    
} 
    

