package com.example.cinema_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.cinema_backend.repository.FeeAndTaxRepository;
import com.example.cinema_backend.model.FeeAndTax;
import java.util.Optional;


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

    @PostMapping("/edit/{id}")
    public FeeAndTax updateFeeAndTax(@PathVariable String id, @RequestBody FeeAndTax updatedft) {

        Optional<FeeAndTax> opt = feeAndTaxRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("Fee and Tax not found with id: " + id);
        }
        FeeAndTax ft = opt.get();
        if (updatedft.getBookingFee() != ft.getBookingFee()) {
            ft.setBookingFee(updatedft.getBookingFee());
        }

        if (updatedft.getTaxRate() != ft.getTaxRate()) {
            ft.setTaxRate(updatedft.getTaxRate());
        }

        return feeAndTaxRepository.save(ft);



    }

    @PostMapping("/add")
    public FeeAndTax add(@RequestBody FeeAndTax ft) {
        return feeAndTaxRepository.save(ft);
    }
    

}
