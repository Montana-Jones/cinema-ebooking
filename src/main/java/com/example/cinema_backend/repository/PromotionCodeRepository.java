package com.example.cinema_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.cinema_backend.model.PromotionCode;

@Repository
public interface PromotionCodeRepository extends MongoRepository<PromotionCode, String> {

}
