package com.example.cinema_backend.repository;

import org.springframework.stereotype.Repository;
import com.example.cinema_backend.model.FeeAndTax;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeeAndTaxRepository extends MongoRepository<FeeAndTax, String> {
    
}


