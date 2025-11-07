package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.cinema_backend.model.Date;
public interface DateRepository extends MongoRepository<Date, String> {
    Date findByDate(String date);
    
}


