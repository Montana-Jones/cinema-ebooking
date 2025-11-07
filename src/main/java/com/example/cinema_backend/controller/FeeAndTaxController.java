package com.example.cinema_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.cinema_backend.repository.FeeAndTaxRepository;
import com.example.cinema_backend.model.FeeAndTax;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/fees-and-taxes")

public class FeeAndTaxController {
    
    @Autowired
    private FeeAndTaxRepository feeAndTaxRepository;

    @GetMapping
    public java.util.List<FeeAndTax> getAllFeesAndTaxes() {
        return feeAndTaxRepository.findAll();    
    }

    

}
