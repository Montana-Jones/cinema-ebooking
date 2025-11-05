package com.example.cinema_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.cinema_backend.repository.PromotionCodeRepository;   
import com.example.cinema_backend.model.PromotionCode;
import java.util.List;



@RestController
@RequestMapping("/api/promotion-codes")
@CrossOrigin(origins = "http://localhost:3000")
public class PromotionCodeController {
    @Autowired
    private PromotionCodeRepository promotionCodeRepository;

    @GetMapping
    public List<PromotionCode> getAllPromotionCodes() {
        return promotionCodeRepository.findAll();
    }

    @GetMapping("/{id}")
    public PromotionCode getPromotionCodeById(@PathVariable String id) {
        return promotionCodeRepository.findById(id).orElse(null);   
    }

    @GetMapping("/code/{code}")
    public PromotionCode getPromotionCodeByCode(@PathVariable String code) {
        List<PromotionCode> codes = promotionCodeRepository.findAll();
        for (PromotionCode pc : codes) {
            if (pc.getCode().equals(code)) {
                return pc;
            }
        }
        return null;
    }
    
}
