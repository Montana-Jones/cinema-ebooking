package com.example.cinema_backend.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.cinema_backend.model.PromotionCode;

public interface PromotionCodeRepository extends MongoRepository<PromotionCode, String> {

}

